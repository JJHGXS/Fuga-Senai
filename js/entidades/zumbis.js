/* ==========================================================================
   js/entidades/zumbis.js - Hordas, Explosão do Boomer e Boss 6m (3 Fases)
   ========================================================================== */

const Zumbis = {
    lista: [],
    cena: null,
    numeroFase: 1,

    inicializar(cena, numeroFase) {
        this.limpar();
        this.cena = cena;
        this.numeroFase = numeroFase;
    },

    limpar() {
        if (this.cena) {
            this.lista.forEach((z) => this.cena.remove(z.mesh));
        }
        this.lista = [];
    },

    // Gera horda respeitando a regra do Bloco 1 (sem mutantes especiais)
    gerarHorda(quantidade, areaSpawn = { minX: -22, maxX: 22, minZ: -25, maxZ: -120 }) {
        const ehBloco1 = this.numeroFase <= 10;

        for (let i = 0; i < quantidade; i++) {
            let tipo = "caminhante";
            const r = Math.random();

            if (ehBloco1) {
                // Bloco 1: Apenas Caminhantes, Corredores e Boomers
                if (r > 0.85) tipo = "boomer";
                else if (r > 0.62) tipo = "corredor";
            } else {
                if (this.numeroFase >= 5 && r > 0.88) tipo = "cacador";
                else if (this.numeroFase >= 4 && r > 0.78) tipo = "cuspidor";
                else if (this.numeroFase >= 3 && r > 0.65) tipo = "blindado";
                else if (r > 0.58) tipo = "boomer";
                else if (r > 0.45) tipo = "corredor";
            }

            const x = areaSpawn.minX + Math.random() * (areaSpawn.maxX - areaSpawn.minX);
            const z = areaSpawn.minZ + Math.random() * (areaSpawn.maxZ - areaSpawn.minZ);
            this.spawnar(tipo, x, 0, z);
        }
    },

    spawnar(tipoId, x, y, z) {
        if (!this.cena) return null;

        const stats = getStatsZumbiPorFase(tipoId, this.numeroFase);
        const geo = new THREE.BoxGeometry(stats.escala.x, stats.escala.y, stats.escala.z);
        const mat = new THREE.MeshLambertMaterial({ color: stats.cor });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(x, y + stats.escala.y / 2, z);
        this.cena.add(mesh);

        const zumbi = {
            mesh,
            stats,
            vida: stats.vidaMax,
            vidaMax: stats.vidaMax,
            cooldownAtaque: 0,
            alertaAtivo: false,
            // Estados exclusivos do Boss Gigante de 6m (Fase 04)
            faseBoss: 1, // 1 = Bala | 2 = Gasolina/Fogo | 3 = Eletrocussão
            encharcadoGasolina: false,
            pegandoFogo: false,
            tempoFogo: 0
        };

        this.lista.push(zumbi);
        return zumbi;
    },

    aplicarDano(zumbi, dano) {
        if (!zumbi) return;

        // Mecânica das 3 Fases do Boss Gigante de 6 Metros (Fase 04)
        if (zumbi.stats.mecanicaTresFases) {
            if (zumbi.faseBoss === 2 && !zumbi.pegandoFogo) {
                // Na Fase 2 ele regenera até ser incendiado com gasolina!
                if (zumbi.encharcadoGasolina) {
                    zumbi.pegandoFogo = true;
                    zumbi.tempoFogo = 12;
                    zumbi.mesh.material.color.setHex(0xff6600);
                    this.mostrarAvisoBoss("🔥 O COLOSSO ESTÁ EM CHAMAS! Regeneração cancelada!");
                } else {
                    this.mostrarAvisoBoss("⚠️ Ele está regenerando! Jogue GALÕES DE GASOLINA nele e atire!");
                    return;
                }
            } else if (zumbi.faseBoss === 3) {
                // Na Fase 3 balas causam dano mínimo; precisa atrair para os cabos elétricos!
                dano *= 0.15;
                this.mostrarAvisoBoss("⚡ Atraia o Boss até os CABOS DE ALTA TENSÃO na arena para eletrocutá-lo!");
            }
        }

        zumbi.vida -= dano;
        zumbi.alertaAtivo = true;

        zumbi.mesh.material.emissive.setHex(0x660000);
        setTimeout(() => {
            if (zumbi.mesh && zumbi.mesh.material) zumbi.mesh.material.emissive.setHex(0x000000);
        }, 80);

        if (zumbi.vida <= 0) {
            // Transição de fases do Boss Gigante de 6m
            if (zumbi.stats.mecanicaTresFases && zumbi.faseBoss < 3) {
                zumbi.faseBoss++;
                zumbi.vida = zumbi.vidaMax * (zumbi.faseBoss === 2 ? 0.75 : 0.60);
                if (zumbi.faseBoss === 2) {
                    zumbi.mesh.material.color.setHex(0x1e8449);
                    this.mostrarAvisoBoss("🧬 FASE 2 DO BOSS: Ele está regenerando! Use GASOLINA + TIRO para queimá-lo!");
                } else if (zumbi.faseBoss === 3) {
                    zumbi.pegandoFogo = false;
                    zumbi.mesh.material.color.setHex(0x2874a6);
                    this.mostrarAvisoBoss("⚡ FASE FINAL DO BOSS: Atraia ele para os FIOS ELÉTRICOS caídos!");
                }
                return;
            }

            // Explosão do Boomer ao morrer
            if (zumbi.stats.explodeAoMorrer) {
                this.detonarBoomer(zumbi);
            }

            if (typeof Jogador !== "undefined") {
                Jogador.registrarAcertoInimigo(dano, true);
            }

            this.cena.remove(zumbi.mesh);
            const idx = this.lista.indexOf(zumbi);
            if (idx !== -1) this.lista.splice(idx, 1);

            // Se derrotou o Boss de uma fase de Boss, conclui a fase
            if (zumbi.stats.ehBoss && typeof MotorJogo !== "undefined") {
                if (this.numeroFase === 4) {
                    alert("⚡ O curto-circuito eletrocutou o Colosso, mas DERRUBOU A ENERGIA DO BAIRRO NOVAMENTE! Rotas 05, 06 e 07 liberadas no Hub!");
                    MotorJogo.concluirFaseAtual(2); // Volta para o Hub (Fase 02)
                } else {
                    MotorJogo.concluirFaseAtual();
                }
            }
        } else if (typeof Jogador !== "undefined") {
            Jogador.registrarAcertoInimigo(dano, false);
        }
    },

    detonarBoomer(boomer) {
        const pos = boomer.mesh.position;
        const raio = boomer.stats.raioExplosao || 5.5;

        // Dano no jogador se estiver colado
        if (typeof Jogador !== "undefined" && Jogador.posicao.distanceTo(pos) <= raio) {
            Jogador.receberDano(boomer.stats.danoExplosao || 45);
        }

        // Dano em outros zumbis próximos
        for (let i = this.lista.length - 1; i >= 0; i--) {
            const outro = this.lista[i];
            if (outro !== boomer && outro.mesh.position.distanceTo(pos) <= raio) {
                outro.vida -= 90;
            }
        }
    },

    mostrarAvisoBoss(texto) {
        const el = document.getElementById("hud-objetivo");
        if (el) el.textContent = texto;
    },

    alertarTodos(origem) {
        this.lista.forEach((z) => {
            if (z.mesh.position.distanceTo(origem) < 65) z.alertaAtivo = true;
        });
    },

    atualizar(delta) {
        if (typeof Jogador === "undefined" || Jogador.estaIncapacitado()) return;

        for (let i = this.lista.length - 1; i >= 0; i--) {
            const z = this.lista[i];
            if (z.cooldownAtaque > 0) z.cooldownAtaque -= delta;

            // Lógica contínua do Boss Gigante de 6m
            if (z.stats.mecanicaTresFases) {
                if (z.faseBoss === 2 && !z.pegandoFogo) {
                    z.vida = Math.min(z.vidaMax, z.vida + 65 * delta); // Regenera rápido sem fogo
                }
                if (z.pegandoFogo) {
                    z.vida -= 140 * delta;
                    if (z.vida <= 0) this.aplicarDano(z, 1);
                }
            }

            const dx = Jogador.posicao.x - z.mesh.position.x;
            const dz = Jogador.posicao.z - z.mesh.position.z;
            const dist = Math.hypot(dx, dz);

            const raioVisao = z.alertaAtivo ? 85 : 32;
            if (dist < raioVisao && dist > 1.35) {
                const vx = (dx / dist) * z.stats.velocidade;
                const vz = (dz / dist) * z.stats.velocidade;
                z.mesh.position.x += vx * delta;
                z.mesh.position.z += vz * delta;
                z.mesh.lookAt(Jogador.posicao.x, z.mesh.position.y, Jogador.posicao.z);
            } else if (dist <= 1.65 && z.cooldownAtaque <= 0) {
                Jogador.receberDano(z.stats.danoFinal);
                z.cooldownAtaque = 1.05;
            }
        }
    }
};