/* ==========================================================================
   js/mapas/construtor.js - Carrega e Monta Cada Mapa Individualmente
   ========================================================================== */

const MAPAS_REGISTRADOS = {};

// Função chamada dentro de cada arquivo fase01.js, fase02.js, etc.
function registrarMapaFase(numeroFase, funcaoMontagem) {
    MAPAS_REGISTRADOS[numeroFase] = funcaoMontagem;
}

const ConstrutorMapa = {
    carregarFase(cena, dadosFase) {
        // 1. Limpa elementos da fase anterior
        PecaPredios.limpar();
        PecaVeiculos.limpar();
        PecaPerigos.limpar();
        Puzzles.limpar();
        if (typeof Itens !== "undefined") Itens.limparTudo(cena);
        if (typeof Zumbis !== "undefined") Zumbis.limparTudo(cena);

        // 2. Se o mapa já estiver carregado na memória, constrói direto
        if (MAPAS_REGISTRADOS[dadosFase.numero]) {
            MAPAS_REGISTRADOS[dadosFase.numero](cena);
            return;
        }

        // 3. Caso contrário, carrega dinamicamente o arquivo js/mapas/faseXX.js
        const script = document.createElement("script");
        script.src = dadosFase.arquivoMapa;

        script.onload = () => {
            if (MAPAS_REGISTRADOS[dadosFase.numero]) {
                MAPAS_REGISTRADOS[dadosFase.numero](cena);
            } else {
                this.construirMapaPadrao(cena, dadosFase);
            }
        };

        script.onerror = () => {
            // Se o arquivo faseXX.js ainda não foi criado, monta uma rota padrão jogável
            console.warn(`Arquivo ${dadosFase.arquivoMapa} ainda não criado. Usando rota padrão.`);
            this.construirMapaPadrao(cena, dadosFase);
        };

        document.body.appendChild(script);
    },

    // Mapa base automático caso o jogador entre em uma fase ainda não desenhada manualmente
    construirMapaPadrao(cena, dadosFase) {
        const ehPuzzle = dadosFase.tipo === "puzzle_compacto";
        const comprimento = ehPuzzle ? 90 : 240;

        PecaTerreno.configurarAmbiente(cena, dadosFase.mecanicas.includes("neblina_densa") ? "neblina_densa" : "dia_nublado");
        PecaTerreno.criarChaoBase(cena, 90, comprimento + 40, 0x2f3640);
        PecaTerreno.criarRua(cena, 0, -comprimento / 2 + 10, 12, comprimento);

        // Casas laterais ao longo da rua
        for (let z = -10; z > -comprimento + 15; z -= 18) {
            PecaPredios.criarCasaSimples(cena, -13, z);
            PecaPredios.criarCasaSimples(cena, 13, z);
        }

        if (ehPuzzle) {
            Puzzles.criarPortaoPuzzle(cena, 0, -comprimento + 25, 3);
            Itens.criarItemChao("fusivel", -5, 0, -25);
            Itens.criarItemChao("fusivel", 5, 0, -45);
            Itens.criarItemChao("fusivel", -4, 0, -60);
        }

        // Posiciona o jogador no início e a saída no final
        Jogador.posicao.set(0, FISICA.alturaJogador, 5);
        Puzzles.criarZonaSaida(cena, 0, -comprimento + 12);

        // Popula alguns infectados iniciais
        for (let z = -25; z > -comprimento + 30; z -= 22) {
            Zumbis.criar("caminhante", (Math.random() - 0.5) * 8, z);
        }
    }
};