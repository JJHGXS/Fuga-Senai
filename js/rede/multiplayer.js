/* ==========================================================================
   js/rede/multiplayer.js - Multiplayer Co-op via Supabase Realtime
   ========================================================================== */

const Multiplayer = {
    SUPABASE_URL: "https://wkhpxvjqwqgfjgqfjqwq.supabase.co",
    SUPABASE_ANON_KEY: "",
    cliente: null,
    canalSala: null,
    conectado: false,
    meuId: "jog_" + Math.random().toString(36).substring(2, 8),
    codigoSala: null,
    aliados: {},
    timerEnvio: 0,

    abrirModalSala() {
        const codigo = prompt("Digite o CÓDIGO DA SALA para entrar ou criar (ex: SENAI01):", "SENAI01");
        if (!codigo) return;
        this.conectarSala(codigo.trim().toUpperCase());
    },

    conectarSala(codigo) {
        this.codigoSala = codigo;
        document.getElementById("tela-inicial").classList.add("oculto");
        document.getElementById("hud-jogo").classList.remove("oculto");

        if (typeof window.supabase !== "undefined" && this.SUPABASE_ANON_KEY) {
            this.cliente = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
            this.canalSala = this.cliente.channel(`sala_${codigo}`);

            this.canalSala
                .on("broadcast", { event: "pos" }, ({ payload }) => this.atualizarAliado(payload))
                .on("broadcast", { event: "status_vida" }, ({ payload }) => {
                    if (this.aliados[payload.id]) this.aliados[payload.id].caido = (payload.status === "caido");
                })
                .on("broadcast", { event: "reviver_aliado" }, ({ payload }) => {
                    if (payload.alvoId === this.meuId && typeof SistemaReanimacao !== "undefined") {
                        SistemaReanimacao.levantarJogador();
                    }
                })
                .subscribe((status) => {
                    if (status === "SUBSCRIBED") this.conectado = true;
                });
        }

        const fase = (typeof getFase === "function") ? getFase(GameConfig.faseAtual) : { numero: 1, nome: "Jardim Novo Mundo", descricao: "" };
        if (typeof MotorJogo !== "undefined") MotorJogo.iniciarFase(fase);
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
        if (!this.conectado || !this.canalSala || typeof Jogador === "undefined") return;
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