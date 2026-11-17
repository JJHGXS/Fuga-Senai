/* ==========================================================================
   js/ui.js - Interface do Lobby, Seleção de Personagens e Mapa das 88 Fases
   ========================================================================== */

const UI = {
    inicializar() {
        this.registrarAbasConfig();
        this.registrarControlesLobby();
        this.registrarBotoesModos();
        this.atualizarCardFaseAtual();
        this.gerarGrade88Fases();
    },

    registrarAbasConfig() {
        const botoesTab = document.querySelectorAll(".tab-btn");
        botoesTab.forEach((btn) => {
            btn.addEventListener("click", () => {
                botoesTab.forEach((b) => b.classList.remove("active"));
                document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

                btn.classList.add("active");
                const alvo = document.getElementById(btn.dataset.tab);
                if (alvo) alvo.classList.add("active");
            });
        });
    },

    registrarControlesLobby() {
        const inputNick = document.getElementById("input-nickname");
        if (inputNick) {
            inputNick.value = GameConfig.nickname || "Aluno_Sobrevivente";
            inputNick.addEventListener("change", () => {
                GameConfig.nickname = inputNick.value.trim() || "Aluno_Sobrevivente";
                salvarConfiguracoes();
            });
        }

        const selPersonagem = document.getElementById("select-personagem");
        if (selPersonagem) {
            selPersonagem.value = GameConfig.personagemSelecionado || "mateus";
            selPersonagem.addEventListener("change", () => {
                GameConfig.personagemSelecionado = selPersonagem.value;
                salvarConfiguracoes();
            });
        }

        const selTamanho = document.getElementById("select-tamanho");
        if (selTamanho) {
            selTamanho.addEventListener("change", () => {
                if (selTamanho.value === "fullscreen") {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    GameConfig.escalaResolucao = parseFloat(selTamanho.value);
                    salvarConfiguracoes();
                    if (typeof MotorJogo !== "undefined") MotorJogo.atualizarResolucao();
                }
            });
        }

        const rangeVol = document.getElementById("range-volume");
        if (rangeVol) {
            rangeVol.addEventListener("input", () => {
                GameConfig.volumeGeral = parseInt(rangeVol.value, 10);
                document.getElementById("valor-volume").textContent = `${GameConfig.volumeGeral}%`;
                salvarConfiguracoes();
            });
        }

        const rangeMus = document.getElementById("range-musica");
        if (rangeMus) {
            rangeMus.addEventListener("input", () => {
                GameConfig.volumeMusica = parseInt(rangeMus.value, 10);
                document.getElementById("valor-musica").textContent = `${GameConfig.volumeMusica}%`;
                salvarConfiguracoes();
            });
        }

        const rangeSens = document.getElementById("range-sens");
        if (rangeSens) {
            rangeSens.addEventListener("input", () => {
                GameConfig.sensibilidade = parseFloat(rangeSens.value);
                document.getElementById("valor-sens").textContent = `${GameConfig.sensibilidade.toFixed(1)}x`;
                salvarConfiguracoes();
            });
        }

        const rangeFov = document.getElementById("range-fov");
        if (rangeFov) {
            rangeFov.addEventListener("input", () => {
                GameConfig.fov = parseInt(rangeFov.value, 10);
                document.getElementById("valor-fov").textContent = `${GameConfig.fov}°`;
                salvarConfiguracoes();
                if (typeof MotorJogo !== "undefined") MotorJogo.atualizarFov();
            });
        }

        const selMira = document.getElementById("select-mira-cor");
        if (selMira) {
            selMira.addEventListener("change", () => {
                GameConfig.corMira = selMira.value;
                document.querySelectorAll(".mira-linha, .mira-ponto").forEach((el) => {
                    el.style.backgroundColor = GameConfig.corMira;
                });
                salvarConfiguracoes();
            });
        }

        const checkFps = document.getElementById("check-fps");
        if (checkFps) {
            checkFps.addEventListener("change", () => {
                const elFps = document.getElementById("fps-counter");
                if (elFps) elFps.style.display = checkFps.checked ? "block" : "none";
            });
        }
    },

    registrarBotoesModos() {
        const btnSolo = document.getElementById("btn-singleplayer");
        if (btnSolo) {
            btnSolo.addEventListener("click", () => {
                document.getElementById("tela-inicial").classList.add("oculto");
                document.getElementById("hud-jogo").classList.remove("oculto");
                const fase = (typeof getFase === "function") ? getFase(GameConfig.faseAtual) : { numero: 1, nome: "Jardim Novo Mundo", descricao: "" };
                if (typeof MotorJogo !== "undefined") MotorJogo.iniciarFase(fase);
            });
        }

        const btnMulti = document.getElementById("btn-multiplayer");
        if (btnMulti) {
            btnMulti.addEventListener("click", () => {
                if (typeof Multiplayer !== "undefined" && typeof Multiplayer.abrirModalSala === "function") {
                    Multiplayer.abrirModalSala();
                } else {
                    alert("Multiplayer Co-op: configure a sala ou jogue no modo Solo enquanto o servidor sincroniza.");
                }
            });
        }

        const btnAbrirFases = document.getElementById("btn-abrir-fases");
        const modalFases = document.getElementById("modal-fases");
        if (btnAbrirFases && modalFases) {
            btnAbrirFases.addEventListener("click", () => {
                this.gerarGrade88Fases();
                modalFases.classList.remove("modal-oculto");
            });
        }

        const btnFecharFases = document.getElementById("btn-fechar-fases");
        if (btnFecharFases && modalFases) {
            btnFecharFases.addEventListener("click", () => {
                modalFases.classList.add("modal-oculto");
            });
        }
    },

    atualizarCardFaseAtual() {
        if (typeof getFase !== "function") return;
        const fase = getFase(GameConfig.faseAtual);
        const numFmt = String(fase.numero).padStart(2, "0");

        const elNum = document.getElementById("label-fase-num");
        const elNome = document.getElementById("nome-fase-atual");
        const elDesc = document.getElementById("desc-fase-atual");
        const elProg = document.getElementById("progresso-jornada");

        if (elNum) elNum.textContent = `FASE ${numFmt} / 88`;
        if (elNome) elNome.textContent = fase.nome;
        if (elDesc) elDesc.textContent = fase.descricao;
        if (elProg) elProg.style.width = `${((fase.numero / 88) * 100).toFixed(2)}%`;
    },

    gerarGrade88Fases() {
        const grid = document.getElementById("grid-88-fases");
        if (!grid || typeof getFase !== "function") return;

        grid.innerHTML = "";
        for (let i = 1; i <= 88; i++) {
            const f = getFase(i);
            const desbloqueada = i <= (GameConfig.fasesDesbloqueadas || 10);
            const card = document.createElement("div");
            card.className = `fase-item ${desbloqueada ? "desbloqueada" : "bloqueada"}`;
            card.style.cssText = `
                padding: 10px; border-radius: 6px; cursor: ${desbloqueada ? "pointer" : "not-allowed"};
                background: ${i === GameConfig.faseAtual ? "#005f73" : "#1e293b"};
                border: 1px solid ${desbloqueada ? "#00d2ff" : "#334155"};
                opacity: ${desbloqueada ? "1" : "0.5"};
            `;
            card.innerHTML = `
                <div style="font-weight:800; color:#00d2ff; font-size:0.8rem;">FASE ${String(i).padStart(2, "0")}</div>
                <div style="font-size:0.85rem; color:#fff; margin-top:2px;">${f.nome}</div>
            `;

            if (desbloqueada) {
                card.addEventListener("click", () => {
                    GameConfig.faseAtual = i;
                    salvarConfiguracoes();
                    this.atualizarCardFaseAtual();
                    document.getElementById("modal-fases").classList.add("modal-oculto");
                });
            }
            grid.appendChild(card);
        }
    },

    atualizarVida(vida, vidaMax) {
        const barra = document.getElementById("barra-vida");
        const texto = document.getElementById("texto-vida");
        if (barra) barra.style.width = `${Math.max(0, (vida / vidaMax) * 100)}%`;
        if (texto) texto.textContent = Math.max(0, Math.round(vida));
    },

    atualizarMunicao(nomeArma, atual, reserva) {
        const elNome = document.getElementById("nome-arma");
        const elMun = document.getElementById("texto-municao");
        if (elNome) elNome.textContent = nomeArma;
        if (elMun) elMun.textContent = `${atual} / ${reserva}`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    UI.inicializar();
});