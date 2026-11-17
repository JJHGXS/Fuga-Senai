/* ==========================================================================
   js/mapas/pecas/puzzles.js - Fusíveis, Alavancas, Botijões, Gasolina e Portais
   ========================================================================== */

const Puzzles = {
    ativos: [],
    interativos: [], // Alavancas, botijões, galões, cabos elétricos e portais
    cena: null,
    mensagemHud: null,

    limpar(cena) {
        this.cena = cena;
        this.ativos = [];
        this.interativos = [];
        this.esconderAviso();
    },

    // 1. Puzzle clássico de Fusíveis
    criarPuzzleFusiveis(cena, xPortao, zPortao, posicoesFusiveis = []) {
        this.cena = cena;
        const portaoMesh = new THREE.Mesh(
            new THREE.BoxGeometry(8, 4.2, 0.8),
            new THREE.MeshLambertMaterial({ color: 0x8b0000 })
        );
        portaoMesh.position.set(xPortao, 2.1, zPortao);
        cena.add(portaoMesh);

        const itensFusiveis = [];
        posicoesFusiveis.forEach((pos) => {
            const fusivel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.25, 0.25, 0.7, 10),
                new THREE.MeshBasicMaterial({ color: 0x00ffff })
            );
            fusivel.position.set(pos.x, 0.8, pos.z);
            cena.add(fusivel);
            itensFusiveis.push({ mesh: fusivel, coletado: false });
        });

        this.ativos.push({
            tipo: "fusiveis",
            portaoMesh,
            itensFusiveis,
            concluido: false
        });
    },

    // 2. Alavanca de Energia (Ex: Prédio Abandonado Fase 03)
    criarAlavancaEnergia(cena, idAlavanca, x, y, z, aoAtivar) {
        this.cena = cena;
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.1, 0.4),
            new THREE.MeshLambertMaterial({ color: 0xf1c40f })
        );
        base.position.set(x, y + 0.55, z);
        cena.add(base);

        this.interativos.push({
            tipo: "alavanca",
            id: idAlavanca,
            mesh: base,
            ativado: false,
            rotulo: "[E] Puxar Alavanca de Energia",
            aoInteragir: () => {
                base.material.color.setHex(0x00ff66);
                if (typeof aoAtivar === "function") aoAtivar();
            }
        });
    },

    // 3. Coletáveis de Missão (Botijões da Ultragaz Fase 05, Galões de Gasolina Fase 04)
    criarItemMissao(cena, subtipo, x, y, z, rotulo, aoColetar) {
        this.cena = cena;
        const cores = {
            botijao_comum: 0x3498db,
            botijao_maior: 0xe67e22,
            botijao_especial: 0x9b59b6,
            galao_gasolina: 0xe74c3c
        };
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.32, 0.32, 0.85, 12),
            new THREE.MeshLambertMaterial({ color: cores[subtipo] || 0xf1c40f })
        );
        mesh.position.set(x, y + 0.45, z);
        cena.add(mesh);

        this.interativos.push({
            tipo: "coletavel",
            subtipo,
            mesh,
            ativado: false,
            rotulo: `[E] Pegar ${rotulo}`,
            aoInteragir: () => {
                cena.remove(mesh);
                if (typeof aoColetar === "function") aoColetar();
            }
        });
    },

    // 4. Cabo de Alta Tensão (Fase 3 do Boss Gigante de 6m)
    criarCaboEletricoArena(cena, x, z) {
        this.cena = cena;
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.35, 3.5),
            new THREE.MeshBasicMaterial({ color: 0x00e5ff })
        );
        mesh.position.set(x, 0.18, z);
        cena.add(mesh);

        this.interativos.push({
            tipo: "cabo_eletrico",
            mesh,
            ativado: false,
            rotulo: "[E] Ativar Descarga Elétrica!",
            aoInteragir: () => {
                if (typeof Zumbis !== "undefined") {
                    Zumbis.lista.forEach((zumbi) => {
                        if (zumbi.stats.mecanicaTresFases && zumbi.faseBoss === 3) {
                            const distBoss = zumbi.mesh.position.distanceTo(mesh.position);
                            if (distBoss <= 9.0) {
                                Zumbis.aplicarDano(zumbi, 9999);
                            } else {
                                Puzzles.mostrarAviso("⚠️ Atraia o Boss mais perto dos cabos antes de ativar!");
                            }
                        }
                    });
                }
            }
        });
    },

    // 5. Portal de Rota do Hub Central (Fases 01 a 10 no Jardim Novo Mundo)
    criarPortalRota(cena, faseDestino, x, y, z, nomeLocal) {
        this.cena = cena;
        const portal = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 3.2, 0.5),
            new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.45 })
        );
        portal.position.set(x, y + 1.6, z);
        cena.add(portal);

        this.interativos.push({
            tipo: "portal_rota",
            faseDestino,
            mesh: portal,
            ativado: false,
            rotulo: `[E] Entrar na Rota ${String(faseDestino).padStart(2, "0")}: ${nomeLocal}`,
            aoInteragir: () => {
                if (typeof SistemaProgresso !== "undefined") {
                    const acesso = SistemaProgresso.verificarAcessoRota(faseDestino);
                    if (!acesso.permitido) {
                        Puzzles.mostrarAviso(`🔒 ${acesso.mensagem}`);
                        return;
                    }
                    // Salva onde o jogador estava no Hub (Fase 02)
                    if (GameConfig.faseAtual === 2 && typeof Jogador !== "undefined") {
                        SistemaProgresso.estado.posicaoHubSalva = {
                            x: Jogador.posicao.x,
                            z: Jogador.posicao.z
                        };
                        SistemaProgresso.salvar();
                    }
                }
                if (typeof MotorJogo !== "undefined") {
                    GameConfig.faseAtual = faseDestino;
                    MotorJogo.iniciarFase(getFase(faseDestino));
                }
            }
        });
    },

    tentarInteragir(posJogador) {
        for (let i = 0; i < this.interativos.length; i++) {
            const item = this.interativos[i];
            if (item.ativado && item.tipo !== "cabo_eletrico" && item.tipo !== "portal_rota") continue;

            if (posJogador.distanceTo(item.mesh.position) <= 3.5) {
                if (item.tipo === "alavanca" || item.tipo === "coletavel") {
                    item.ativado = true;
                }
                item.aoInteragir();
                break;
            }
        }
    },

    mostrarAviso(texto) {
        if (!this.mensagemHud) {
            this.mensagemHud = document.createElement("div");
            this.mensagemHud.style.cssText = `
                position: fixed; bottom: 130px; left: 50%; transform: translateX(-50%);
                background: rgba(10, 15, 25, 0.9); color: #00e5ff; padding: 10px 20px;
                border: 1px solid #00e5ff; border-radius: 6px; font-weight: 700;
                font-family: sans-serif; z-index: 8500; pointer-events: none;
            `;
            document.body.appendChild(this.mensagemHud);
        }
        this.mensagemHud.textContent = texto;
        this.mensagemHud.style.display = "block";
    },

    esconderAviso() {
        if (this.mensagemHud) this.mensagemHud.style.display = "none";
    },

    atualizar() {
        if (typeof Jogador === "undefined") return;

        // 1. Atualiza fusíveis clássicos
        this.ativos.forEach((p) => {
            if (p.concluido || p.tipo !== "fusiveis") return;
            let coletados = 0;
            p.itensFusiveis.forEach((f) => {
                if (!f.coletado) {
                    f.mesh.rotation.y += 0.04;
                    if (Jogador.posicao.distanceTo(f.mesh.position) < 2.2) {
                        f.coletado = true;
                        this.cena.remove(f.mesh);
                    }
                }
                if (f.coletado) coletados++;
            });

            if (coletados === p.itensFusiveis.length) {
                p.concluido = true;
                this.cena.remove(p.portaoMesh);
            }
        });

        // 2. Mostra prompt [E] quando perto de alavancas, botijões ou portais
        let achouPerto = false;
        for (let i = 0; i < this.interativos.length; i++) {
            const item = this.interativos[i];
            if (item.ativado && item.tipo !== "cabo_eletrico" && item.tipo !== "portal_rota") continue;

            if (Jogador.posicao.distanceTo(item.mesh.position) <= 3.5) {
                this.mostrarAviso(item.rotulo);
                achouPerto = true;
                break;
            }
        }
        if (!achouPerto) this.esconderAviso();
    }
};