/* ==========================================================================
   js/mapas/pecas/veiculos.js - Veículos Abandonados e Carros com Alarme (L4D)
   ========================================================================== */

const PecaVeiculos = {
    carrosAlarme: [],

    limpar() {
        this.carrosAlarme = [];
    },

    criarCarro(cena, x, z, rotacaoY = 0, cor = 0x3498db, temAlarme = false) {
        const grupo = new THREE.Group();
        grupo.position.set(x, 0, z);
        grupo.rotation.y = rotacaoY;

        // Chassi inferior
        const chassi = new THREE.Mesh(
            new THREE.BoxGeometry(2.1, 0.85, 4.4),
            new THREE.MeshLambertMaterial({ color: temAlarme ? 0xe74c3c : cor })
        );
        chassi.position.y = 0.65;

        // Cabine / Vidros
        const cabine = new THREE.Mesh(
            new THREE.BoxGeometry(1.85, 0.7, 2.3),
            new THREE.MeshLambertMaterial({ color: 0x1e272e })
        );
        cabine.position.set(0, 1.4, -0.2);

        grupo.add(chassi, cabine);
        cena.add(grupo);

        if (typeof PecaPredios !== "undefined") {
            PecaPredios.colisores.push(new THREE.Box3().setFromObject(chassi));
        }

        if (temAlarme) {
            // Farol piscante visual indicando que o carro tem alarme ativo
            const giroflex = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.15, 0.4),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            giroflex.position.set(0, 1.82, 0);
            grupo.add(giroflex);

            this.carrosAlarme.push({
                mesh: grupo,
                giroflex,
                posicao: grupo.position,
                disparado: false,
                timerPisca: 0
            });
        }
    },

    criarOnibus(cena, x, z, rotacaoY = 0) {
        const onibus = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 3.1, 10.5),
            new THREE.MeshLambertMaterial({ color: 0xf39c12 })
        );
        onibus.position.set(x, 1.55, z);
        onibus.rotation.y = rotacaoY;
        cena.add(onibus);

        if (typeof PecaPredios !== "undefined") {
            PecaPredios.colisores.push(new THREE.Box3().setFromObject(onibus));
        }
    },

    // Verifica se o jogador encostou/subiu ou atirou perto de um carro com alarme
    atualizar(delta) {
        if (typeof Jogador === "undefined") return;

        this.carrosAlarme.forEach(carro => {
            if (!carro.disparado && carro.posicao.distanceTo(Jogador.posicao) < 3.0) {
                this.dispararAlarme(carro);
            }

            if (carro.disparado) {
                carro.timerPisca += delta * 10;
                carro.giroflex.visible = Math.sin(carro.timerPisca) > 0;
            }
        });
    },

    dispararAlarme(carro) {
        if (carro.disparado) return;
        carro.disparado = true;
        console.log("🚨 ALARME DE CARRO DISPARADO! Uma horda está vindo!");

        if (typeof Zumbis !== "undefined") {
            Zumbis.invocarHorda(carro.posicao, 14, true);
        }
    }
};