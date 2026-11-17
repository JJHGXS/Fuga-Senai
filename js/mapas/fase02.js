/* ==========================================================================
   js/mapas/fase02.js - Hub Central: Labirinto Completo do Jardim Novo Mundo
   ========================================================================== */

const MapaFase02 = {
    construir(cena) {
        cena.background = new THREE.Color(0x1b222c);
        cena.fog = new THREE.FogExp2(0x1b222c, 0.009);

        // Chão amplo do bairro Jardim Novo Mundo (260x260)
        const asfalto = new THREE.Mesh(
            new THREE.PlaneGeometry(260, 260),
            new THREE.MeshLambertMaterial({ color: 0x2a2e35 })
        );
        asfalto.rotation.x = -Math.PI / 2;
        cena.add(asfalto);

        // Pontos Reais do Bairro (Bases de Loot e Marcos Visuais do Print)
        const pontosReais = [
            { nome: "RASGA PREÇO",          x: -25, z: -20, w: 14, d: 12, cor: 0x1e6091, loot: ["municao", "municao", "pilulas"] },
            { nome: "DROGARIA NOVO MUNDO",  x: 22,  z: -35, w: 10, d: 9,  cor: 0xc0392b, loot: ["kit_medico", "kit_medico", "pilulas"] },
            { nome: "BARRACÃO NORDESTINO",  x: 45,  z: 18,  w: 15, d: 12, cor: 0xd35400, loot: ["municao", "municao", "kit_medico"] },
            { nome: "AR TELHADOS",          x: -35, z: 32,  w: 14, d: 10, cor: 0x7f8c8d, loot: ["municao", "pilulas"] },
            { nome: "IMPERIUM",             x: -45, z: 12,  w: 11, d: 10, cor: 0x5b2c6f, loot: ["pilulas", "municao"] },
            { nome: "DETAILS CAR",          x: -28, z: 58,  w: 12, d: 10, cor: 0x2c3e50, loot: ["municao", "kit_medico"] },
            { nome: "REVENDA ULTRAGAZ",     x: 48,  z: -62, w: 14, d: 12, cor: 0x2980b9, loot: ["municao", "municao"] }
        ];

        pontosReais.forEach((p) => {
            const predio = new THREE.Mesh(
                new THREE.BoxGeometry(p.w, 5.2, p.d),
                new THREE.MeshLambertMaterial({ color: p.cor })
            );
            predio.position.set(p.x, 2.6, p.z);
            cena.add(predio);

            // Spawna os loots na frente/lateral de cada estabelecimento
            if (typeof Itens !== "undefined") {
                p.loot.forEach((tipoLoot, idx) => {
                    Itens.spawnarPickup(cena, tipoLoot, p.x - 4 + idx * 3.5, p.z + p.d / 2 + 2.2);
                });
            }
        });

        // Casas coladas formando as vielas e quarteirões do labirinto da favela
        const blocosFavela = [
            { x: -12, z: 5 },  { x: 12, z: 5 },   { x: 0, z: -48 },
            { x: -58, z: -38 },{ x: 62, z: -15 }, { x: 18, z: 42 },
            { x: -12, z: 45 }, { x: 60, z: 48 },  { x: -65, z: 48 },
            { x: 0, z: -82 },  { x: -35, z: -75 },{ x: 35, z: -85 }
        ];

        blocosFavela.forEach((b, i) => {
            const altura = 3.8 + (i % 3) * 1.4;
            const casa = new THREE.Mesh(
                new THREE.BoxGeometry(11, altura, 11),
                new THREE.MeshLambertMaterial({ color: i % 2 === 0 ? 0x8c4a32 : 0x6e665f })
            );
            casa.position.set(b.x, altura / 2, b.z);
            cena.add(casa);
        });

        // Portais das Rotas do Bloco 1 espalhados pelo Hub do Novo Mundo
        if (typeof Puzzles !== "undefined") {
            Puzzles.criarPortalRota(cena, 1,  0,   0,  22, "Terreno Baldio (Bloqueado)");
            Puzzles.criarPortalRota(cena, 3, -52,  0, -52, "Prédio Abandonado (5 Andares)");
            Puzzles.criarPortalRota(cena, 4, -75,  0,   0, "Campo Cercado (Boss Colosso 6m)");
            Puzzles.criarPortalRota(cena, 5,  48,  0, -52, "Revenda Ultragaz (Gás)");
            Puzzles.criarPortalRota(cena, 6,  68,  0,  20, "Oficina / Peças do Gerador");
            Puzzles.criarPortalRota(cena, 7, -42,  0,  32, "AR Telhados / Fiação");
            Puzzles.criarPortalRota(cena, 8, -72,  0, -78, "R. Frederico Harder");
            Puzzles.criarPortalRota(cena, 9,  0,   0, -108,"Av. Laura Maiello Kook");
            Puzzles.criarPortalRota(cena, 10, 28,  0, -115,"Saída do Jardim Novo Mundo");
        }

        // Horda massiva espalhada pelas vielas do bairro
        if (typeof Zumbis !== "undefined") {
            Zumbis.gerarHorda(55, { minX: -95, maxX: 95, minZ: -95, maxZ: 75 });
        }

        const elObj = document.getElementById("hud-objetivo");
        if (elObj) {
            elObj.textContent = "🗺️ Hub Jardim Novo Mundo: Explore o bairro, colete loot e entre nas rotas liberadas!";
        }
    }
};