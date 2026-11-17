/* ==========================================================================
   js/mapas/pecas/terreno.js - Asfalto, Calçadas, Grama, Rios e Neblina
   ========================================================================== */

const PecaTerreno = {
    criarChaoBase(cena, largura = 120, comprimento = 400, cor = 0x2c3e50) {
        const geo = new THREE.PlaneGeometry(largura, comprimento);
        const mat = new THREE.MeshLambertMaterial({ color: cor });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(0, 0, -comprimento / 2 + 15);
        cena.add(mesh);
        return mesh;
    },

    criarRua(cena, x, z, largura = 12, comprimento = 80) {
        // Asfalto
        const asfalto = new THREE.Mesh(
            new THREE.BoxGeometry(largura, 0.08, comprimento),
            new THREE.MeshLambertMaterial({ color: 0x1e272e })
        );
        asfalto.position.set(x, 0.04, z);
        cena.add(asfalto);

        // Calçadas laterais
        const calcadaGeo = new THREE.BoxGeometry(2.5, 0.22, comprimento);
        const calcadaMat = new THREE.MeshLambertMaterial({ color: 0x7f8fa6 });

        const calcadaEsq = new THREE.Mesh(calcadaGeo, calcadaMat);
        calcadaEsq.position.set(x - (largura / 2 + 1.25), 0.11, z);

        const calcadaDir = new THREE.Mesh(calcadaGeo, calcadaMat);
        calcadaDir.position.set(x + (largura / 2 + 1.25), 0.11, z);

        cena.add(calcadaEsq, calcadaDir);
    },

    configurarAmbiente(cena, tema = "dia_nublado") {
        if (tema === "neblina_densa") {
            cena.background = new THREE.Color(0x1a1f26);
            cena.fog = new THREE.FogExp2(0x1a1f26, 0.032);
        } else if (tema === "noite_apagao") {
            cena.background = new THREE.Color(0x07090d);
            cena.fog = new THREE.FogExp2(0x07090d, 0.042);
        } else {
            // Dia nublado / fim de tarde estilo Left 4 Dead
            cena.background = new THREE.Color(0x2c3a47);
            cena.fog = new THREE.FogExp2(0x2c3a47, 0.011);
        }
    }
};