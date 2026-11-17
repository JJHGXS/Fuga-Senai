/* ==========================================================================
   js/config.js - Configurações Globais, Física e Traduções (PT / EN / ES)
   ========================================================================== */

const CONFIG_PADRAO = {
    nickname: "Aluno_Sobrevivente",
    personagemSelecionado: "mateus", // mateus, nicolas, luan, rodrigo, kaua, joao_cba
    idioma: "pt",
    escalaResolucao: 1,              // 1 = 100%, 0.75 = 75%, 0.5 = 50%
    volumeGeral: 0.8,                // 0.0 a 1.0
    volumeMusica: 0.5,               // 0.0 a 1.0
    sensibilidade: 1.0,              // Multiplicador do mouse
    fov: 85,                         // Campo de visão (60 a 110)
    corMira: "#00ff66",              // Cor hexadecimal da mira
    mostrarFps: true,
    faseAtual: 1,                    // Começa na Fase 01 (Saída do Jardim Novo Mundo)
    fasesDesbloqueadas: 1,
    modoJogo: "single"               // "single" ou "multi"
};

// Objeto ativo lido por todos os módulos do jogo
const GameConfig = { ...CONFIG_PADRAO };

// Física estilo Krunker (movimentação rápida, pulo e slide)
const FISICA = {
    gravidade: 32.0,
    velocidadeAndar: 11.0,
    velocidadeCorrer: 17.5,
    forcaPulo: 11.5,
    velocidadeSlide: 22.0,
    alturaJogador: 1.75,
    alturaAgachado: 1.0
};

// Dicionário de Idiomas para todos os textos da interface
const IDIOMAS = {
    pt: {
        titulo: 'FUGA PARA O <span class="destaque-vermelho">SENAI</span>',
        subgenero: "SURVIVAL FPS • SOROCABA / VOTORANTIM",
        rotaTexto: "NOVO MUNDO (VOTORANTIM) ➔ SENAI LUIZ PAGLIATO",
        verMapa: "🗺️ VER MAPA DAS 88 FASES",
        jogarSolo: "JOGAR SOLO (CAMPANHA)",
        jogarSoloSub: "Enfrente a horda sozinho rumo ao Luiz Pagliato",
        jogarMulti: "MULTIPLAYER CO-OP (4 JOGADORES)",
        jogarMultiSub: "Criar sala ou entrar com amigos da turma",
        tabGeral: "⚙️ GERAL & ÁUDIO",
        tabVideo: "🖥️ VÍDEO & MIRA",
        labelTamanho: "Tamanho / Resolução da Tela",
        labelVolume: "Volume Geral (Tiros e Horda)",
        labelMusica: "Música de Tensão",
        labelSens: "Sensibilidade do Mouse",
        labelFov: "Campo de Visão (FOV)",
        labelMira: "Cor da Mira (Crosshair)",
        labelFps: "Mostrar Contador de FPS",
        hudSaude: "SAÚDE",
        hudObjetivo: "Elimine os infectados e chegue à saída!"
    },
    en: {
        titulo: 'ESCAPE TO <span class="destaque-vermelho">SENAI</span>',
        subgenero: "SURVIVAL FPS • SOROCABA / VOTORANTIM",
        rotaTexto: "NOVO MUNDO (VOTORANTIM) ➔ SENAI LUIZ PAGLIATO",
        verMapa: "🗺️ VIEW 88 STAGES MAP",
        jogarSolo: "PLAY SOLO (CAMPAIGN)",
        jogarSoloSub: "Face the horde alone towards Luiz Pagliato",
        jogarMulti: "MULTIPLAYER CO-OP (4 PLAYERS)",
        jogarMultiSub: "Create a room or join with classmates",
        tabGeral: "⚙️ GENERAL & AUDIO",
        tabVideo: "🖥️ VIDEO & CROSSHAIR",
        labelTamanho: "Screen Size / Resolution",
        labelVolume: "Master Volume (Shots & Horde)",
        labelMusica: "Tension Music",
        labelSens: "Mouse Sensitivity",
        labelFov: "Field of View (FOV)",
        labelMira: "Crosshair Color",
        labelFps: "Show FPS Counter",
        hudSaude: "HEALTH",
        hudObjetivo: "Eliminate the infected and reach the exit!"
    },
    es: {
        titulo: 'ESCAPE AL <span class="destaque-vermelho">SENAI</span>',
        subgenero: "FPS DE SUPERVIVENCIA • SOROCABA / VOTORANTIM",
        rotaTexto: "NOVO MUNDO (VOTORANTIM) ➔ SENAI LUIZ PAGLIATO",
        verMapa: "🗺️ VER MAPA DE LAS 88 FASES",
        jogarSolo: "JUGAR SOLO (CAMPAÑA)",
        jogarSoloSub: "Enfrenta la horda solo rumbo a Luiz Pagliato",
        jogarMulti: "MULTIJUGADOR CO-OP (4 JUGADORES)",
        jogarMultiSub: "Crear sala o unirse con compañeros de clase",
        tabGeral: "⚙️ GENERAL Y AUDIO",
        tabVideo: "🖥️ VIDEO Y MIRA",
        labelTamanho: "Tamaño / Resolución de Pantalla",
        labelVolume: "Volumen General (Disparos y Horda)",
        labelMusica: "Música de Tensión",
        labelSens: "Sensibilidad del Ratón",
        labelFov: "Campo de Visión (FOV)",
        labelMira: "Color de la Mira (Crosshair)",
        labelFps: "Mostrar Contador de FPS",
        hudSaude: "SALUD",
        hudObjetivo: "¡Elimina a los infectados y llega a la salida!"
    }
};

// Salva as configurações no navegador do jogador
function salvarConfiguracoes() {
    try {
        localStorage.setItem("fuga_senai_config", JSON.stringify(GameConfig));
    } catch (e) {
        console.warn("Não foi possível salvar configurações:", e);
    }
}

// Carrega as configurações salvas ao abrir o jogo
function carregarConfiguracoes() {
    try {
        const salvo = localStorage.getItem("fuga_senai_config");
        if (salvo) {
            const dados = JSON.parse(salvo);
            Object.assign(GameConfig, dados);
        }
    } catch (e) {
        console.warn("Usando configurações padrão:", e);
    }
}

carregarConfiguracoes();