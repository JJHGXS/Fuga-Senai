/* ==========================================================================
   js/mapas/pecas/predios.js - Casas, Comércios, Muros, Barricadas e Oficinas
   ========================================================================== */

const PecaPredios = {
    colisores: [],

    limpar() {
        this.colisores = [];
    },

    criarBlocoConstrucao(cena, x, z, largura, altura, profundidade, cor = 0x57606f) {
        const geo = new THREE.BoxGeometry(largura, altura, profundidade);
        const mat = new THREE.MeshLambertMaterial({ color: cor });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, altura / 2, z);
        cena.add(mesh);

        this.colisores.push(new THREE.Box3().setFromObject(mesh));
        return mesh;
    },

    criarCasaSimples(cena, x, z, corParede = 0xd1ccc0) {
        const grupo = new THREE.Group();
        grupo.position.set(x, 0, z);

        const corpo = new THREE.Mesh(
            new THREE.BoxGeometry(9, 4.2, 10),
            new THREE.MeshLambertMaterial({ color: corParede })
        );
        corpo.position.y = 2.1;

        const telhado = new THREE.Mesh(
            new THREE.BoxGeometry(9.6, 0.6, 10.6),
            new THREE.MeshLambertMaterial({ color: 0x8c2d19 })
        );
        telhado.position.y = 4.5;

        grupo.add(corpo, telhado);
        cena.add(grupo);
        this.colisores.push(new THREE.Box3().setFromObject(corpo));
    },

    criarBarricada(cena, x, z, largura = 6) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(largura, 1.35, 0.8),
            new THREE.MeshLambertMaterial({ color: 0x6d4c41 })
        );
        mesh.position.set(x, 0.675, z);
        cena.add(mesh);
        this.colisores.push(new THREE.Box3().setFromObject(mesh));
    },

    // Estrutura icônica do SENAI Luiz Pagliato (Fase 88)
    criarFachadaSenai(cena, x, z) {
        this.criarBlocoConstrucao(cena, x, z, 36, 9, 14, 0xc0392b); // Prédio vermelho SENAI
        const letreiro = new THREE.Mesh(
            new THREE.BoxGeometry(16, 2.2, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        letreiro.position.set(x, 6.5, z + 7.2);
        cena.add(letreiro);
    }
};