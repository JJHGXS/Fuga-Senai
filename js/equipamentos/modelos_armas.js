/* ==========================================================================
   js/equipamentos/modelos_armas.js - Visual 3D Low-Poly das Armas (Estilo Krunker)
   ========================================================================== */

const ModelosArmas = {
    grupoArma: null,
    posicaoBase: new THREE.Vector3(0.32, -0.28, -0.55),

    inicializar(camera) {
        this.grupoArma = new THREE.Group();
        this.grupoArma.position.copy(this.posicaoBase);
        camera.add(this.grupoArma);
    },

    desenharArmaNaMao(arma) {
        if (!this.grupoArma) return;

        // Limpa o modelo anterior
        while (this.grupoArma.children.length > 0) {
            this.grupoArma.remove(this.grupoArma.children[0]);
        }

        const matCorpo = new THREE.MeshLambertMaterial({ color: arma.corPrincipal });
        const matMetal = new THREE.MeshLambertMaterial({ color: 0x1e272e });
        const matMadeira = new THREE.MeshLambertMaterial({ color: 0x6d4c41 });

        // Corpo principal padrão (estilo blocos Krunker)
        const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.45), matCorpo);
        this.grupoArma.add(corpo);

        // Detalhes visuais conforme o formato da tabela
        if (arma.formato === "sniper_longa" || arma.formato === "rifle_luneta") {
            const cano = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.55), matMetal);
            cano.position.set(0, 0.02, -0.45);
            const luneta = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.25), matMetal);
            luneta.position.set(0, 0.09, -0.05);
            this.grupoArma.add(cano, luneta);
        } else if (arma.formato === "ak_curvo" || arma.formato === "ak_tambor") {
            const coronha = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.25), matMadeira);
            coronha.position.set(0, -0.02, 0.30);
            const pente = arma.formato === "ak_tambor"
                ? new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 12), matMetal)
                : new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.08), matMetal);
            pente.position.set(0, -0.12, -0.05);
            this.grupoArma.add(coronha, pente);
        } else if (arma.formato === "silenciador_grosso" || arma.formato === "pistola_silenciada") {
            const silenciador = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.28, 10), matMetal);
            silenciador.rotation.x = Math.PI / 2;
            silenciador.position.set(0, 0.02, -0.35);
            this.grupoArma.add(silenciador);
        } else if (arma.formato === "tambor_redondo") {
            const tambor = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 14), matMetal);
            tambor.rotation.z = Math.PI / 2;
            tambor.position.set(0, -0.08, -0.08);
            this.grupoArma.add(tambor);
        } else if (arma.formato === "giratoria") {
            const canos = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 8), matMetal);
            canos.rotation.x = Math.PI / 2;
            canos.position.set(0, -0.02, -0.45);
            this.grupoArma.add(canos);
        } else if (arma.formato === "ferramenta") {
            corpo.scale.set(0.5, 0.5, 0.9);
            const cabeca = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.08), matMetal);
            cabeca.position.set(0, 0.03, -0.22);
            this.grupoArma.add(cabeca);
        }
    },

    animarRecuo() {
        if (!this.grupoArma) return;
        this.grupoArma.position.z = this.posicaoBase.z + 0.08;
        this.grupoArma.rotation.x = 0.08;
        setTimeout(() => {
            if (this.grupoArma) {
                this.grupoArma.position.copy(this.posicaoBase);
                this.grupoArma.rotation.x = 0;
            }
        }, 70);
    }
};