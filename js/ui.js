/* ==========================================================================
   js/ui.js - Controle da Tela Inicial, Modais, Idiomas e HUD
   ========================================================================== */

const UI = {
    inicializar() {
        this.sincronizarCamposComConfig();
        this.registrarEventos();
        this.aplicarIdioma(GameConfig.idioma);
        this.atualizarCorMira(GameConfig.corMira);
        this.atualizarCardFaseAtual();
        this.gerarGrade88Fases();
    },

    // Preenche os inputs da tela com os valores salvos no GameConfig
    sincronizarCamposComConfig() {
        document.getElementById("input-nickname").value = GameConfig.nickname;
        document.getElementById("select-idioma").value = GameConfig.idioma;
        document.getElementById("select-tamanho").value = String(GameConfig.escalaResolucao);

        const selPersonagem = document.getElementById("select-personagem");
        if (selPersonagem) {
            selPersonagem.value = GameConfig.personagemSelecionado || "mateus";
        }

        const volPct = Math.round(GameConfig.volumeGeral * 100);
        document.getElementById("range-volume").value = volPct;
        document.getElementById("valor-volume").textContent = `${volPct}%`;

        const musPct = Math.round(GameConfig.volumeMusica * 100);
        document.getElementById("range-musica").value = musPct;
        document.getElementById("valor-musica").textContent = `${musPct}%`;

        document.getElementById("range-sens").value = GameConfig.sensibilidade;
        document.getElementById("valor-sens").textContent = `${GameConfig.sensibilidade.toFixed(1)}x`;

        document.getElementById("range-fov").value = GameConfig.fov;
        document.getElementById("valor-fov").textContent = `${GameConfig.fov}°`;

        document.getElementById("select-mira-cor").value = GameConfig.corMira;
        document.getElementById("check-fps").checked = GameConfig.mostrarFps;
        document.getElementById("fps-counter").style.display = GameConfig.mostrarFps ? "block" : "none";
    },

    // Conecta cliques, sliders e seletores
    registrarEventos() {
        // Nickname
        document.getElementById("input-nickname").addEventListener("change", (e) => {
            GameConfig.nickname = e.target.value.trim() || "Aluno_Sobrevivente";
            salvarConfiguracoes();
        });

        // Seletor dos 6 Personagens
        const selPersonagem = document.getElementById("select-personagem");
        if (selPersonagem) {
            selPersonagem.addEventListener("change", (e) => {
                GameConfig.personagemSelecionado = e.target.value;
                salvarConfiguracoes();
            });
        }

        // Idioma
        document.getElementById("select-idioma").addEventListener("change", (e) => {
            GameConfig.idioma = e.target.value;
            this.aplicarIdioma(GameConfig.idioma);
            salvarConfiguracoes();
        });

        // Abas de Configuração (Geral & Áudio / Vídeo & Mira)
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

                btn.classList.add("active");
                const alvo = btn.getAttribute("data-tab");
                document.getElementById(alvo).classList.add("active");
            });
        });

        // Tamanho / Resolução / Fullscreen
        document.getElementById("select-tamanho").addEventListener("change", (e) => {
            const val = e.target.value;
            if (val === "fullscreen") {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                }
            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen