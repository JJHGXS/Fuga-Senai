/* ==========================================================================
   js/mapas/pecas/predios.js - Construções, Casas de Favela e Fachadas
   ========================================================================== */

const PecaPredios = {
    criarPredioLateral(cena, x, z, largura = 10, altura = 10, profundidade = 14, cor = 0x546e7a) {
        const geo = new THREE.BoxGeometry(largura, altura, profundidade);
        const mat = new THREE.MeshLambertMaterial({ color: cor });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, altura / 2, z);
        cena.add(mesh);
        return mesh;
    },

    criarCasaFavela(cena, x, z, largura = 8, altura = 4.2, profundidade = 8) {
        const grupo = new THREE.Group();

        // Estrutura principal em tijolo aparente
        const paredeGeo = new THREE.BoxGeometry(largura, altura, profundidade);
        const paredeMat = new THREE.MeshLambertMaterial({ color: 0x8c4a32 });
        const paredes = new THREE.Mesh(paredeGeo, paredeMat);
        paredes.position.y = altura / 2;
        grupo.add(paredes);

        // Laje de concreto no topo
        const lajeGeo = new THREE.BoxGeometry(largura + 0.4, 0.35, profundidade + 0.4);
        const lajeMat = new THREE.MeshLambertMaterial({ color: 0x6e6a63 });
        const laje = new THREE.Mesh(lajeGeo, lajeMat);
        laje.position.y = altura + 0.17;
        grupo.add(laje);

        grupo.position.set(x, 0, z);
        cena.add(grupo);
        return grupo;
    }
};