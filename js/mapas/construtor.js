/* ==========================================================================
   js/mapas/construtor.js - Montador Modular de Mapas (Fases 01 a 88)
   ========================================================================== */

const ConstrutorMapa = {
    carregarFase(cena, dadosFase) {
        // Limpa peças e timers anteriores
        if (typeof Puzzles !== "undefined") Puzzles.limpar(cena);
        if (typeof Zumbis !== "undefined") Zumbis.inicializar(cena, dadosFase.numero);
        if (typeof Itens !== "undefined") Itens.limpar(cena);
        if (typeof PecaVeiculos !== "undefined") PecaVeiculos.limpar();
        if (typeof PecaPerigos !== "undefined") PecaPerigos.limpar();

        if (typeof MapaFase01 !== "undefined") MapaFase01.limparTimers();
        if (typeof MapaFase05 !== "undefined") MapaFase05.limparTimers();

        // Roteia para os mapas customizados do Bloco 1 (Jardim Novo Mundo)
        if (dadosFase.numero === 1 && typeof MapaFase01 !== "undefined") {
            MapaFase01.construir(cena);
            return;
        }
        if (dadosFase.numero === 2 && typeof MapaFase02 !== "undefined") {
            MapaFase02.construir(cena);
            return;
        }
        if (dadosFase.numero === 3 && typeof MapaFase03 !== "undefined") {
            MapaFase03.construir(cena);
            return;
        }
        if (dadosFase.numero === 4 && typeof MapaFase04 !== "undefined") {
            MapaFase04.construir(cena);
            return;
        }
        if (dadosFase.numero === 5 && typeof MapaFase05 !== "undefined") {
            MapaFase05.construir(cena);
            return;
        }

        // Construção procedural padrão para as demais fases da campanha (06 a 88)
        this.construirRotaPadrao(cena, dadosFase);
    },

    construirRotaPadrao(cena, dadosFase) {
        const ehNoturna = (dadosFase.numero % 10 >= 7) || dadosFase.numero >= 31;
        const corCeu = ehNoturna ? 0x0b0f17 : 0x263238;
        cena.background = new THREE.Color(corCeu);
        cena.fog = new THREE.FogExp2(corCeu, 0.011);

        const comprimento = dadosFase.ehPuzzle ? 90 : 180;
        const largura = 36;

        if (typeof PecaTerreno !== "undefined") {
            PecaTerreno.criarRuaAsfalto(cena, largura, comprimento);
        }

        // Prédios laterais e obstáculos
        for (let z = -15; z > -comprimento + 15; z -= 18) {
            if (typeof PecaPredios !== "undefined") {
                PecaPredios.criarPredioLateral(cena, -largura / 2 - 6, z, 10, 8 + (Math.abs(z) % 6), 14);
                PecaPredios.criarPredioLateral(cena, largura / 2 + 6, z, 10, 8 + (Math.abs(z) % 5), 14);
            }
        }

        // Suprimentos e Horda
        if (typeof Itens !== "undefined") {
            Itens.spawnarPickup(cena, "municao", -5, -25);
            Itens.spawnarPickup(cena, "kit_medico", 6, -55);
            Itens.spawnarPickup(cena, "municao", -4, -95);
        }

        if (typeof Zumbis !== "undefined") {
            const qtdZumbis = 18 + Math.floor(dadosFase.numero * 0.4);
            Zumbis.gerarHorda(qtdZumbis, {
                minX: -14,
                maxX: 14,
                minZ: -comprimento + 25,
                maxZ: -18
            });

            if (dadosFase.ehBoss) {
                Zumbis.spawnar("boss_bloco", 0, 0, -comprimento + 22);
            }
        }

        // Zona de Extração / Saída no final da rua
        const zonaSaida = new THREE.Mesh(
            new THREE.BoxGeometry(10, 0.3, 6),
            new THREE.MeshBasicMaterial({ color: 0x00ff66, transparent: true, opacity: 0.55 })
        );
        zonaSaida.position.set(0, 0.15, -comprimento + 10);
        cena.add(zonaSaida);

        // Checagem simples de chegada na zona verde
        const checkSaida = setInterval(() => {
            if (typeof MotorJogo === "undefined" || !MotorJogo.emExecucao) return;
            if (GameConfig.faseAtual !== dadosFase.numero) {
                clearInterval(checkSaida);
                return;
            }
            if (typeof Jogador !== "undefined" && Jogador.posicao.z <= -comprimento + 13) {
                clearInterval(checkSaida);
                // Se for fase do Bloco 1 (6 a 9), volta ao Hub (Fase 02)
                if (dadosFase.numero >= 6 && dadosFase.numero <= 9) {
                    MotorJogo.concluirFaseAtual(2);
                } else {
                    MotorJogo.concluirFaseAtual();
                }
            }
        }, 500);
    }
};