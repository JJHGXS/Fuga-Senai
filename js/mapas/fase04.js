/* ==========================================================================
   js/mapas/fase04.js - Fase 04: Arena Cercada de Árvores e Boss 6m (3 Fases)
   ========================================================================== */

const MapaFase04 = {
    bossRef: null,

    construir(cena) {
        cena.background = new THREE.Color(0x141b16);
        cena.fog = new THREE.FogExp2(0x141b16, 0.015);

        // Chão de terra e grama da arena fechada
        const chao = new THREE.Mesh(
            new THREE.PlaneGeometry(90, 90),
            new THREE.MeshLambertMaterial({ color: 0x364231 })
        );
        chao.rotation.x = -Math.PI / 2;
        cena.add(chao);

        // Perímetro bloqueado por árvores caídas, troncos e mata fechada ao redor
        const raioArena = 34;
        for (let i = 0; i < 36; i++) {
            const ang = (i / 36) * Math.PI * 2;
            const x = Math.cos(ang) * raioArena;
            const z = Math.sin(ang) * raioArena;

            // Tronco de árvore caída bloqueando a passagem
            const tronco = new THREE.Mesh(
                new THREE.CylinderGeometry(0.9, 1.1, 7.5, 8),
                new THREE.MeshLambertMaterial({ color: 0x4e3629 })
            );
            tronco.position.set(x, 0.9, z);
            tronco.rotation.z = Math.PI / 2;
            tronco.rotation.y = ang + Math.PI / 2;
            cena.add(tronco);

            // Copa/arbusto denso atrás dos troncos
            const copa = new THREE.Mesh(
                new THREE.DodecahedronGeometry(3.2),
                new THREE.MeshLambertMaterial({ color: 0x1e4620 })
            );
            copa.position.set(x * 1.08, 2.4, z * 1.08);
            cena.add(copa);
        }

        // Suprimentos espalhados pelas bordas da arena
        if (typeof Itens !== "undefined") {
            Itens.spawnarPickup(cena, "municao", -18, 12);
            Itens.spawnarPickup(cena, "municao", 18, 12);
            Itens.spawnarPickup(cena, "municao", 0, -22);
            Itens.spawnarPickup(cena, "kit_medico", -20, -14);
            Itens.spawnarPickup(cena, "kit_medico", 20, -14);
        }

        // Spawna o Boss Gigante de 6 Metros (3 Fases: Bala -> Gasolina/Fogo -> Eletrocussão)
        if (typeof Zumbis !== "undefined") {
            this.bossRef = Zumbis.spawnar("boss_gigante_6m", 0, 0, -18);
        }

        // Galões de Gasolina (Fase 2 do Boss: derramar no Boss e atirar para queimar)
        const posGaloes = [
            { x: -14, z: -8 },
            { x: 14, z: -8 },
            { x: -12, z: 16 },
            { x: 12, z: 16 }
        ];

        if (typeof Puzzles !== "undefined") {
            posGaloes.forEach((pos, idx) => {
                Puzzles.criarItemMissao(
                    cena,
                    "galao