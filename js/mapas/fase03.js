/* ==========================================================================
   js/mapas/fase03.js - Fase 03: Prédio Abandonado (5 Andares e Alavanca)
   ========================================================================== */

const MapaFase03 = {
    alavancaPuxada: false,

    construir(cena) {
        this.alavancaPuxada = false;

        cena.background = new THREE.Color(0x11141a);
        cena.fog = new THREE.FogExp2(0x11141a, 0.018);

        const largura = 26;
        const profundidade = 26;
        const alturaAndar = 4.2;

        // Constrói os 5 andares de concreto abandonado + rampas de subida
        for (let andar = 0; andar < 5; andar++) {
            const yPiso = andar * alturaAndar;

            // Laje do andar
            const laje = new THREE.Mesh(
                new THREE.BoxGeometry(largura, 0.4, profundidade),
                new THREE.MeshLambertMaterial({ color: 0x4b525c })
            );
            laje.position.set(0, yPiso, 0);
            cena.add(laje);

            // Paredes externas com vãos
            const matParede = new THREE.MeshLambertMaterial({ color: 0x373c44 });
            const paredeFundo = new THREE.Mesh(new THREE.BoxGeometry(largura, alturaAndar, 0.5), matParede);
            paredeFundo.position.set(0, yPiso + alturaAndar / 2, -profundidade / 2);
            cena.add(paredeFundo);

            const paredeEsq = new THREE.Mesh(new THREE.BoxGeometry(0.5, alturaAndar, profundidade), matParede);
            paredeEsq.position.set(-largura / 2, yPiso + alturaAndar / 2, 0);
            cena.add(paredeEsq);

            const paredeDir = new THREE.Mesh(new THREE.BoxGeometry(0.5, alturaAndar, profundidade), matParede);
            paredeDir.position.set(largura / 2, yPiso + alturaAndar / 2, 0);
            cena.add(paredeDir);

            // Rampa interna para subir ao próximo andar (até o 5º andar)
            if (andar < 4) {
                const ladoX = andar % 2 === 0 ? 8 : -8;
                const rampa = new THREE.Mesh(
                    new THREE.BoxGeometry(4.5, 0.35, 11),
                    new THREE.MeshLambertMaterial({ color: 0x6c757d })
                );
                rampa.position.set(ladoX, yPiso + alturaAndar / 2, 0);
                rampa.rotation.x = andar % 2 === 0 ? 0.36 : -0.36;
                cena.add(rampa);
            }

            // Spawna zumbis e Boomers em cada andar
            if (typeof Zumbis !== "undefined") {
                for (let z = 0; z < 6; z++) {
                    const tipo = (andar >= 2 && z % 3 === 0) ? "boomer" : (z % 2 === 0 ? "corredor" : "caminhante");
                    Zumbis.spawnar(tipo, -8 + z * 3, yPiso + 0.2, -6 + (andar * 2));
                }
            }
        }

        // 5º Andar (y = 4 * 4.2 = 16.8): Escombros escondendo a Alavanca de Energia
        const yTopo = 4 * alturaAndar + 0.2;
        const escombros = new THREE.Mesh(
            new THREE.BoxGeometry(4.5, 1.8, 3.5),
            new THREE.MeshLambertMaterial({ color: 0x5c5852 })
        );
        escombros.position.set(-7, yTopo + 0.9, -8);
        cena.add(escombros);

        if (typeof Puzzles !== "undefined") {
            Puzzles.criarAlavancaEnergia(cena, "alavanca_predio_f3", -9.5, yTopo, -9.5, () => {
                this.alavancaPuxada = true;
                alert("⚡ ENERGIA RESTAURADA! Horda subindo as escadas — desça até a saída no térreo para voltar ao bairro!");

                // Horda massiva na descida
                if (typeof Zumbis !== "undefined") {
                    Zumbis.gerarHorda(22, { minX: -10, maxX: 10, minZ: -10, maxZ: 10 });
                }

                // Libera o portal de volta para o Hub (Fase 02) no térreo
                Puzzles.criarPortalRota(cena, 2, 0, 0, 10, "Voltar ao Jardim Novo Mundo (Fase 02)");
                if (typeof SistemaProgresso !== "undefined") {
                    SistemaProgresso.concluirFase(3);
                }
            });
        }

        const elObj = document.getElementById("hud-objetivo");
        if (elObj) {
            elObj.textContent = "🏢 Suba os 5 andares do Prédio Abandonado e ache a alavanca nos escombros!";
        }
    }
};