/* ==========================================================================
   js/rede/multiplayer.js - Multiplayer Co-op (4 Jogadores) via Supabase Realtime
   ========================================================================== */

const SUPABASE_URL = "https://nydtlrsouqwtlrrsokjr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WsUufY__IyGrsLZtmUSJfA_yMBc1lBn";

const Multiplayer = {
    clienteSupabase: null,
    canalSala: null,
    codigoSala: null,
    meuId: "player_" + Math.random().toString(36).substring(2, 8),
    ehHost: false,
    conectado: false,
    aliados: {}, // { id: { nickname, personagem, mesh, ultimaPos } }
    timerEnvioPos: 0,

    // Inicializa o cliente Supabase
    conectarCliente() {
        if (this.clienteSupabase) return true;

        if (typeof supabase !== "undefined" && SUPABASE_URL.startsWith("http")) {
            this.clienteSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return true;
        }
        return false;
    },

    // Abre a janela rápida para Criar Sala ou Entrar com Código
    abrirLobbySala() {
        let modal = document.getElementById("modal-multiplayer");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modal-multiplayer";
            modal.style.cssText = `
                position: fixed; inset: 0; background: rgba(6, 9, 15, 0.92);
                display: flex; align-items: center; justify-content: center; z-index: 9999;
            `;
            modal.innerHTML = `
                <div style="background:#121824; border:1px solid #00d2ff; border-radius:10px; padding:24px; width:380px; color:#fff; font-family:sans-serif;">
                    <h2 style="margin:0 0 8px; color:#00d2ff;">👥 MULTIPLAYER CO-OP (4 JOGADORES)</h2>
                    <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:18px;">
                        Jogue com a turma usando o código da sala.
                    </p>
                    <button id="btn-mp-criar" style="width:100%; padding:12px; background:#00d2ff; color:#000; font-weight:800; border:none; border-radius:6px; cursor:pointer; margin-bottom:14px;">
                        ➕ CRIAR NOVA SALA (HOST)
                    </button>
                    <div style="display:flex; gap:8px; margin-bottom:16px;">
                        <input id="input-mp-codigo" type="text" placeholder="CÓDIGO (EX: SENAI-12)" maxlength="10"
                            style="flex:1; padding:10px; border-radius:6px; border:1px solid #334155; background:#0b0f17; color:#fff; text-transform:uppercase;">
                        <button id="btn-mp-entrar" style="padding:10px 16px; background:#2ecc71; color:#000; font-weight:800; border:none; border-radius:6px; cursor:pointer;">
                            ENTRAR
                        </button>
                    </div>
                    <button id="btn-mp-fechar" style="width:100%; padding:8px; background:transparent; color:#94a3b8; border:1px solid #334155; border-radius:6px; cursor:pointer;">
                        VOLTAR
                    </button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById("btn-mp-fechar").onclick = () => modal.remove();

            document.getElementById("btn-mp-criar").onclick = () => {
                const codigo = "SENAI-" + Math.floor(10 + Math.random() * 89);
                modal.remove();
                this.entrarNaSala(codigo, true);
            };

            document.getElementById("btn-mp-entrar").onclick = () => {
                const codigo = document.getElementById("input-mp-codigo").value.trim().toUpperCase();
                if (!codigo) return alert("Digite o código da sala!");
                modal.remove();
                this.entrarNaSala(codigo, false);
            };
        }
    },

    entrarNaSala(codigo, comoHost) {
        this.codigoSala = codigo;
        this.ehHost = comoHost;
        const pronto = this.conectarCliente();

        if (!pronto) {
            console.warn("⚠️ CDN do Supabase não encontrado no index.html. Iniciando em modo local.");
            UI.iniciarPartida();
            return;
        }

        // Cria o canal Realtime Broadcast da sala
        this.canalSala = this.clienteSupabase.channel(`sala_${codigo}`, {
            config: { broadcast: { self: false } }
        });

        // Recebe movimentação dos aliados
        this.canalSala.on("broadcast", { event: "pos" }, ({ payload }) => {
            this.atualizarAliadoRemoto(payload);
        });

        // Recebe habilidades em equipe (Mateus Buff/Reset e Rodrigo Cura)
        this.canalSala.on("broadcast", { event: "habilidade_equipe" }, ({ payload }) => {
            this.receberHabilidadeEquipe(payload);
        });

        this.canalSala.subscribe((status) => {
            if (status === "SUBSCRIBED") {
                this.conectado = true;
                alert(`Conectado à Sala: ${codigo} (${comoHost ? "HOST" : "CONVIDADO"})`);
                UI.iniciarPartida();
            }
        });
    },

    // Chamado a cada frame pelo loop do MotorJogo
    atualizar(delta) {
        if (!this.conectado || !this.canalSala || typeof Jogador === "undefined") return;

        // Envia posição a cada 50ms (20 pacotes/seg) para manter fluido sem travar
        this.timerEnvioPos += delta;
        if (this.timerEnvioPos >= 0.05) {
            this.timerEnvioPos = 0;
            this.canalSala.send({
                type: "broadcast",
                event: "pos",
                payload: {
                    id: this.meuId,
                    nickname: GameConfig.nickname,
                    personagem: GameConfig.personagemSelecionado,
                    x: Jogador.posicao.x,
                    y: Jogador.posicao.y,
                    z: Jogador.posicao.z,
                    yaw: Jogador.rotacaoYaw
                }
            });
        }
    },

    // Desenha ou move o boneco 3D dos colegas da turma na cena
    atualizarAliadoRemoto(dados) {
        if (typeof MotorJogo === "undefined" || !MotorJogo.cena) return;

        let aliado = this.aliados[dados.id];
        if (!aliado) {
            const coresClasse = {
                mateus: 0x00d2ff,
                nicolas: 0xe67e22,
                luan: 0xf1c40f,
                rodrigo: 0x2ecc71,
                kaua: 0x9b59b6,
                joao_cba: 0xff3b3b
            };
            const cor = coresClasse[dados.personagem] || 0xffffff;
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.75, 1.75, 0.55),
                new THREE.MeshLambertMaterial({ color: cor })
            );
            MotorJogo.cena.add(mesh);
            aliado = { mesh, dados };
            this.aliados[dados.id] = aliado;
        }

        aliado.mesh.position.set(dados.x, dados.y - 0.875, dados.z);
        aliado.mesh.rotation.y = dados.yaw;
    },

    // Mateus (Comandante) ativa Buff de Dano + Reset de Cooldown para a equipe
    aplicarBuffMateus() {
        if (!this.conectado || !this.canalSala) return;
        this.canalSala.send({
            type: "broadcast",
            event: "habilidade_equipe",
            payload: { tipo: "buff_mateus", origem: this.meuId }
        });
    },

    // Rodrigo (Médico) cura 50% da vida dos aliados próximos
    curarAliadosProximos(porcentagem = 0.50) {
        if (!this.conectado || !this.canalSala) return;
        this.canalSala.send({
            type: "broadcast",
            event: "habilidade_equipe",
            payload: { tipo: "cura_rodrigo", porcentagem, origem: this.meuId }
        });
    },

    receberHabilidadeEquipe(payload) {
        if (typeof Jogador === "undefined") return;

        if (payload.tipo === "buff_mateus") {
            Jogador.tempoBuffAtivo = LISTA_PERSONAGENS.mateus.habilidade.duracaoSegundos;
            Jogador.cooldownHabilidade = 0; // Reset de cooldown do Mateus!
            console.log("⚡ Mateus ativou Ordem de Avanço: Dano aumentado e Cooldown resetado!");
        }

        if (payload.tipo === "cura_rodrigo") {
            // Respeita a regra: João CBA não recebe cura de médico
            Jogador.curar(Jogador.vidaMax * payload.porcentagem, "medico");
        }
    }
};