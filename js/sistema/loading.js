/* ==========================================================================
   js/sistema/loading.js - Tela de Carregamento (Loading Screen)
   ========================================================================== */

const TelaLoading = {
    overlay: null,
    dicas: [
        "Cuidado ao atirar em Boomers perto de botijões de gás ou aliados.",
        "No Jardim Novo Mundo (Fase 02), explore o Rasga Preço e a Drogaria para repor munição e kits.",
        "O João CBA não recebe cura de médico — use sua passiva de roubo de vida ao atirar!",
        "Se um aliado cair, a equipe tem 120 segundos para segurar [E] e levantá-lo.",
        "Use [ESPAÇO] correndo para dar Slide estilo Krunker e escapar de cercos."
    ],

    inicializar() {
        if (this.overlay) return;
        this.overlay = document.createElement("div");
        this.overlay.id = "tela-loading-fase";
        this.overlay.style.cssText = "position:fixed;inset:0;background:#070a10;display:none;flex-direction:column;justify-content:space-between;padding:40px 60px;z-index:10000;color:#fff;font-family:sans-serif;";
        this.overlay.innerHTML = `
            <div>
                <div style="color:#ff3b3b;font-weight:800;letter-spacing:2px;font-size:0.85rem;">FUGA PARA O SENAI • CARREGANDO SETOR</div>
                <h1 id="loading-titulo-fase" style="margin:8px 0 4px;font-size:2.2rem;color:#00d2ff;">FASE 01</h1>
                <p id="loading-desc-fase" style="color:#94a3b8;max-width:650px;font-size:1rem;"></p>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-left:4px solid #00d2ff;padding:16px 20px;border-radius:6px;max-width:700px;">
                <div style="font-size:0.75rem;color:#00d2ff;font-weight:800;margin-bottom:4px;">💡 DICA DE SOBREVIVÊNCIA</div>
                <div id="loading-dica-texto" style="color:#e2e8f0;font-size:0.95rem;"></div>
            </div>
            <div>
                <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#94a3b8;margin-bottom:8px;">
                    <span id="loading-status-texto">Preparando mapa 3D...</span>
                    <span id="loading-porcentagem" style="color:#00ff66;font-weight:800;">0%</span>
                </div>
                <div style="width:100%;height:10px;background:#1e293b;border-radius:5px;overflow:hidden;">
                    <div id="loading-barra-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#ff3b3b,#00d2ff);transition:width 0.15s;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    },

    exibirTransicao(dadosFase, callbackCarregamento) {
        this.inicializar();
        if (document.pointerLockElement) document.exitPointerLock();

        const numFmt = String(dadosFase.numero).padStart(2, "0");
        document.getElementById("loading-titulo-fase").textContent = `FASE ${numFmt}: ${dadosFase.nome.toUpperCase()}`;
        document.getElementById("loading-desc-fase").textContent = dadosFase.descricao || "";
        document.getElementById("loading-dica-texto").textContent = this.dicas[Math.floor(Math.random() * this.dicas.length)];

        const barra = document.getElementById("loading-barra-fill");
        const pct = document.getElementById("loading-porcentagem");
        barra.style.width = "15%";
        pct.textContent = "15%";
        this.overlay.style.display = "flex";

        setTimeout(() => {
            barra.style.width = "65%";
            pct.textContent = "65%";
            if (typeof callbackCarregamento === "function") callbackCarregamento();

            setTimeout(() => {
                barra.style.width = "100%";
                pct.textContent = "100%";
                setTimeout(() => { this.overlay.style.display = "none"; }, 200);
            }, 250);
        }, 200);
    }
};