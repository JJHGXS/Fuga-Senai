/* ==========================================================================
   js/mapas/pecas/perigos.js - Bandos de Corvos de Alerta e Barris Explosivos
   ========================================================================== */

const PecaPerigos = {
    bandosCorvos: [],

    limpar() {
        this.bandosCorvos = [];
    },

    // Cria um bando de corvos no chão; se o jogador chegar perto correndo/atirando, eles voam e chamam a horda
    criarBandoCorvos(cena, x, z) {
        const grupo = new THREE.Group();
        grupo.position.set(x, 0.15, z);

        const matCorvo = new THREE.MeshLambertMaterial({ color: 0x111111 });
        for (let i = 0; i < 6; i++) {
            const corvo = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.38), matCorvo);
            corvo.position.set((Math.random() - 0.5) * 2.2, 0, (Math.random() - 0.5) * 2.2);
            grupo.add(corvo);
        }

        cena.add(grupo);
        this.bandosCorvos.push({
            mesh: grupo,
            posicao: grupo.position,
            assustados: false
        });
    },

    atualizar(delta) {
        if (typeof Jogador === "undefined") return;

        for (let i = this.bandosCorvos.length - 1; i >= 0; i--) {
            const bando = this.bandosCorvos[i];

            // Se o jogador se aproximar rápido (< 6.5m) sem estar agachado, assusta os corvos
            if (!bando.assustados) {
                const dist = bando.posicao.distanceTo(Jogador.posicao);
                if (dist < 6.5 && !Jogador.agachado) {
                    this.assustarCorvos(bando);
                }
            } else {
                // Faz os corvos subirem voando antes de desaparecerem
                bando.mesh.position.y += 14 * delta;
                if (bando.mesh.position.y > 30) {
                    if (typeof MotorJogo !== "undefined" && MotorJogo.cena) {
                        MotorJogo.cena.remove(bando.mesh);
                    }
                    this.bandosCorvos.splice(i, 1);
                }
            }
        }
    },

    assustarCorvos(bando) {
        bando.assustados = true;
        console.log("🐦‍⬛ VOCÊ ASSUSTOU OS CORVOS! Os gritos alertaram os infectados!");

        if (typeof Zumbis !== "undefined") {
            Zumbis.invocarHorda(bando.posicao, 12, false);
        }
    }
};