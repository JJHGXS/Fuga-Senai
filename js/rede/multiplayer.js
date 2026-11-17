/* ==========================================================================
   js/rede/multiplayer.js - Sala de Espera (Lobby Co-op) e Sync Supabase
   ========================================================================== */

const Multiplayer = {
    SUPABASE_URL: "https://wkhpxvjqwqgfjgqfjqwq.supabase.co",
    SUPABASE_ANON_KEY: "", // Cole sua chave anon public do Supabase aqui
    cliente: null,
    canalSala: null,
    conectado: false,
    ehHost: false,
    partidaIniciada: false,
    meuId: "jog_" + Math.random().toString(36).substring(2, 8),
    codigoSala: null,
    jogadoresNaSala: {}, // Lista do Lobby (até 4 jogadores)
    aliados: {},         // Meshes 3D em jogo
    timerEnvio: 0,
    modalLobby: null,

    abrirModalSala() {
        this.criarInterfaceLobby();
        this.modalLobby.style.display = "flex";
        document.getElementById("lobby-passo-codigo").style.display = "block";
        document.getElementById("lobby-passo-espera").style.display = "none";
    },

    criarInterfaceLobby() {
        if (this.modalLobby) return;

        this.modalLobby = document.createElement("div");
        this.modalLobby.id = "modal-lobby-coop";
        this.modalLobby.style.cssText = `
            position: fixed; inset: 0; background: rgba(5, 8, 15, 0.92);
            display: none; align-items: center; justify-content: center;
            z-index: 9500; font-family: sans-serif; color: #fff;
        `;

        this.modalLobby.innerHTML = `
            <div style="background:#0f172a; border:2px solid #00d2ff; border-radius:12px; width:92%; max-width:540px; padding:26px; box-shadow:0 0 30px rgba(0,210,255,0.25);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:12px; margin-bottom:18px;">
                    <h2 style="margin:0; font-size:1.25rem; color:#00d2ff;">👥 MULTIPLAYER CO-OP (ATÉ 4 JOGADORES)</h2>
                    <button id="btn-fechar-lobby-coop" style="background:none; border:none; color:#94a3b8; font-size:1.3rem; cursor:pointer;">✖</button>
                </div>

                <!-- PASSO 1: CRIAR OU ENTRAR -->
                <div id="lobby-passo-codigo">
                    <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:14px;">
                        Crie uma sala de espera para a turma ou digite o código enviado pelo líder:
                    </p>
                    <button id="btn-criar-sala-coop" style="width:100%; padding:14px; background:#00d2ff; color:#05080f; font-weight:800; border:none; border-radius:8px; cursor:pointer; font-size:1rem; margin-bottom:16px;">
                        ➕ CRIAR NOVA SALA DE ESPERA
                    </button>

                    <div style="display:flex; gap:8px;">
                        <input type="text" id="input-codigo-sala" placeholder="Ex: SENAI42" maxlength="10"
                            style="flex:1; padding:12px; background:#1e293b; border:1px solid #334155; border-radius:8px; color:#fff; font-weight:700; text-transform:uppercase;">
                        <button id="btn-entrar-sala-coop" style="padding:12px 20px; background:#22c55e; color:#05080f; font-weight:800; border:none; border-radius:8px; cursor:pointer;">
                            ENTRAR
                        </button>
                    </div>
                </div>

                <!-- PASSO 2: SALA DE ESPERA ATIVA -->
                <div id="lobby-passo-espera" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:12px 16px; border-radius:8px; margin-bottom:16px;">
                        <div>
                            <span style="font-size:0.75rem; color:#94a3b8; display:block;">CÓDIGO DA SALA</span>
                            <strong id="lbl-codigo-ativo" style="font-size:1.4rem; color:#fde047; letter-spacing:2px;">SENAI01</strong>
                        </div>
                        <button id="btn-copiar-codigo" style="padding:8px 14px; background:#334155; color:#fff; border:1px solid #475569; border-radius:6px; cursor:pointer; font-weight:700;">
                            📋 COPIAR
                        </button>
                    </div>

                    <div style="font-size:0.8rem; color:#94a3b8; font-weight:700; margin-bottom:8px;">
                        SOBREVIVENTES NA SALA (<span id="lbl-qtd-jogadores">1</span>/4):
                    </div>
                    <div id="lista-jogadores-espera" style="display:flex; flex-direction:column; gap:8px; margin-bottom:18px;"></div>

                    <div id="aviso-status-sala" style="font-size:0.85rem; color:#38bdf8; text-align:center; margin-bottom:12px;">
                        Aguardando jogadores entrarem...
                    </div>

                    <button id="btn-iniciar-partida-coop" style="width:100%; padding:14px; background:#ff3b3b; color:#fff; font-weight:800; border:none; border-radius:8px; cursor:pointer; font-size:1rem;">
                        ▶ INICIAR PARTIDA PARA TODOS
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.modalLobby);

        document.getElementById("btn-fechar-lobby-coop").onclick = () => this.sairDaSala();

        document.getElementById("btn-criar-sala-coop").onclick = () => {
            const aleatorio = "SENAI" + Math.floor(10 + Math.random() * 89);
            this.entrarNaSalaDeEspera(aleatorio, true);
        };

        document.getElementById("btn-entrar-sala-coop").onclick = () => {
            const cod = document.getElementById("input-codigo-sala").value.trim().toUpperCase();
            if (!cod) return alert("Digite o código da sala!");
            this.entrarNaSalaDeEspera(cod, false);
        };

        document.getElementById("btn-copiar-codigo").onclick = () => {
            navigator.clipboard?.writeText(this.codigoSala);
            document.getElementById("btn-copiar-codigo").textContent = "✅ COPIADO!";
            setTimeout(() => { document.getElementById("btn-copiar-codigo").textContent = "📋 COPIAR"; }, 1500);
        };

        document.getElementById("btn-iniciar-partida-coop").onclick = () => {
            if (!this.ehHost) return;
            const faseEscolhida = GameConfig.faseAtual || 1;
            if (this.conectado && this.canalSala) {
                this.canalSala.send({
                    type: "broadcast",
                    event: "comecar_partida",
                    payload: { fase: faseEscolhida }
                });
            }
            this.comecarJogoParaMim(faseEscolhida);
        };
    },

    entrarNaSalaDeEspera(codigo, comoHost) {
        this.codigoSala = codigo;
        this.ehHost = comoHost;
        this.partidaIniciada = false;

        document.getElementById("lobby-passo-codigo").style.display = "none";
        document.getElementById("lobby-passo-espera").style.display = "block";
        document.getElementById("lbl-codigo-ativo").textContent = codigo;

        const btnIniciar = document.getElementById("btn-iniciar-partida-coop");
        const aviso = document.getElementById("aviso-status-sala");

        if (this.ehHost) {
            btnIniciar.style.display = "block";
            aviso.textContent = "Você é o Líder da Sala. Clique em Iniciar quando todos entrarem!";
        } else {
            btnIniciar.style.display = "none";
            aviso.textContent = "⏳ Aguardando o Líder da Sala iniciar a partida...";
        }

        const meuPerfil = {
            id: this.meuId,
            nick: GameConfig.nickname || "Aluno_Sobrevivente",
            personagem: GameConfig.personagemSelecionado || "mateus",
            host: this.ehHost
        };
        this.jogadoresNaSala = { [this.meuId]: meuPerfil };
        this.renderizarListaEspera();

        // Conecta no Supabase Realtime (Presence + Broadcast)
        if (typeof window.supabase !== "undefined" && this.SUPABASE_ANON_KEY) {
            this.cliente = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
            this.canalSala = this.cliente.channel(`sala_${codigo}`, {
                config: { presence: { key: this.meuId } }
            });

            this.canalSala
                .on("presence", { event: "sync" }, () => {
                    const estado = this.canalSala.presenceState();
                    this.jogadoresNaSala = {};
                    Object.values(estado).forEach((lista) => {
                        if (lista[0]) this.jogadoresNaSala[lista[0].id] = lista[0];
                    });
                    this.renderizarListaEspera();
                })
                .on("broadcast", { event: "comecar_partida" }, ({ payload }) => {
                    this.comecarJogoParaMim(payload.fase || 1);
                })
                .on("broadcast", { event: "pos" }, ({ payload }) => this.atualizarAliado(payload))
                .on("broadcast", { event: "status_vida" }, ({ payload }) => {
                    if (this.aliados[payload.id]) this.aliados[payload.id].caido = (payload.status === "caido");
                })
                .on("broadcast", { event: "reviver_aliado" }, ({ payload }) => {
                    if (payload.alvoId === this.meuId && typeof SistemaReanimacao !== "undefined") {
                        SistemaReanimacao.levantarJogador();
                    }
                })
                .subscribe(async (status) => {
                    if (status === "SUBSCRIBED") {
                        this.conectado = true;
                        await this.canalSala.track(meuPerfil);
                    }
                });
        } else {
            aviso.innerHTML = "⚠️ <b>Modo Local:</b> Adicione sua <code>SUPABASE_ANON_KEY</code> em <code>js/rede/multiplayer.js</code> para sincronizar PCs diferentes.";
        }
    },

    renderizarListaEspera() {
        const container = document.getElementById("lista-jogadores-espera");
        const lblQtd = document.getElementById("lbl-qtd-jogadores");
        if (!container) return;

        const lista = Object.values(this.jogadoresNaSala).slice(0, 4);
        if (lblQtd) lblQtd.textContent = lista.length;

        const nomesClasses = {
            mateus: "Mateus (Comandante)",
            nicolas: "Nicolas (Tanker)",
            luan: "Luan (Engenheiro)",
            rodrigo: "Rodrigo (Médico)",
            kaua: "Kaua (Sniper)",
            joao_cba: "João CBA (Assault)"
        };

        container.innerHTML = lista.map((j) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:6px; border-left:4px solid ${j.host ? "#fde047" : "#00d2ff"};">
                <div>
                    <strong>${j.nick}</strong> ${j.host ? "<span style='color:#fde047; font-size:0.75rem;'>👑 LÍDER</span>" : ""}
                    <div style="font-size:0.8rem; color:#94a3b8;">${nomesClasses[j.personagem] || j.personagem}</div>
                </div>
                <span style="color:#22c55e; font-size:0.8rem; font-weight:700;">● PRONTO</span>
            </div>
        `).join("");
    },

    comecarJogoParaMim(numeroFase) {
        if (this.partidaIniciada) return;
        this.partidaIniciada = true;

        if (this.modalLobby) this.modalLobby.style.display = "none";
        document.getElementById("tela-inicial").classList.add("oculto");
        document.getElementById("hud-jogo").classList.remove("oculto");

        GameConfig.faseAtual = numeroFase;
        const fase = (typeof getFase === "function") ? getFase(numeroFase) : { numero: 1, nome: "Jardim Novo Mundo", descricao: "" };
        if (typeof MotorJogo !== "undefined") MotorJogo.iniciarFase(fase);
    },

    sairDaSala() {
        if (this.canalSala) {
            this.canalSala.unsubscribe();
            this.canalSala = null;
        }
        this.conectado = false;
        this.ehHost = false;
        if (this.modalLobby) this.modalLobby.style.display = "none";
    },

    atualizarAliado(dados) {
        if (!dados || dados.id === this.meuId || typeof MotorJogo === "undefined" || !MotorJogo.cena) return;

        if (!this.aliados[dados.id]) {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.75, 1.75, 0.55),
                new THREE.MeshLambertMaterial({ color: 0x00d2ff })
            );
            MotorJogo.cena.add(mesh);
            this.aliados[dados.id] = { mesh, caido: false };
        }

        this.aliados[dados.id].mesh.position.set(dados.x, dados.y - 0.85, dados.z);
        this.aliados[dados.id].mesh.rotation.y = dados.yaw || 0;
    },

    aplicarBuffMateus() {
        if (this.conectado && this.canalSala) {
            this.canalSala.send({ type: "broadcast", event: "buff_mateus", payload: { origem: this.meuId } });
        }
    },

    curarAliadosProximos(pct) {
        if (this.conectado && this.canalSala) {
            this.canalSala.send({ type: "broadcast", event: "cura_rodrigo", payload: { pct } });
        }
    },

    atualizar(delta) {
        if (!this.conectado || !this.canalSala || !this.partidaIniciada || typeof Jogador === "undefined") return;
        this.timerEnvio += delta;
        if (this.timerEnvio >= 0.05) {
            this.timerEnvio = 0;
            this.canalSala.send({
                type: "broadcast",
                event: "pos",
                payload: {
                    id: this.meuId,
                    x: Jogador.posicao.x,
                    y: Jogador.posicao.y,
                    z: Jogador.posicao.z,
                    yaw: Jogador.rotacaoYaw
                }
            });
        }
    }
};