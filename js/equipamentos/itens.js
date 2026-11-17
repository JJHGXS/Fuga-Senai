/* ==========================================================================
   js/equipamentos/itens.js - Pickups de Munição, Kit Médico, Pílulas e Torreta
   ========================================================================== */

const Itens = {
    pickups: [],
    torretas: [],
    cena: null,

    limpar(cena) {
        this.cena = cena;
        this.pickups.forEach((p) => cena.remove(p.mesh));
        this.torretas.forEach((t) => cena.remove(t.mesh));
        this.pickups = [];
        this.torretas = [];
    },

    spawnarPickup(cena, tipo, x, z) {
        this.cena = cena;
        const cores = {
            municao: 0xf1c40f,
            kit_medico: 0x2ecc71,
            pilulas: 0x3498db
        };

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.5, 0.7),
            new THREE.MeshLambertMaterial({ color: cores[tipo] || 0xffffff })
        );
        mesh.position.set(x, 0.4, z);
        cena.add(mesh);

        this.pickups.push({ tipo, mesh, coletado: false });
    },

    implantarTorreta(posJogador, yaw) {
        if (!this.cena) return;
        const frente = new THREE.Vector3(0, 0, -2.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.1, 0.8),
            new THREE.MeshLambertMaterial({ color: 0xe67e22 })
        );
        mesh.position.set(posJogador.x + frente.x, 0.55, posJogador.z + frente.z);
        this.cena.add(mesh);

        this.torretas.push({ mesh, vidaTempo: 25, cooldownTiro: 0 });
    },

    atualizar(delta) {
        if (typeof Jogador === "undefined") return;

        // Coleta de suprimentos no chão
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            const p = this.pickups[i];
            p.mesh.rotation.y += 2 * delta;

            if (Jogador.posicao.distanceTo(p.mesh.position) <= 2.0) {
                if (p.tipo === "kit_medico") {
                    Jogador.curar(50, "kit");
                } else if (p.tipo === "pilulas") {
                    Jogador.curar(25, "pilulas");
                } else if (p.tipo === "municao" && typeof SistemaArmas !== "undefined") {
                    SistemaArmas.reabastecerTudo();
                }

                if (this.cena) this.cena.remove(p.mesh);
                this.pickups.splice(i, 1);
            }
        }

        // Disparo automático das torretas do Luan
        for (let i = this.torretas.length - 1; i >= 0; i--) {
            const t = this.torretas[i];
            t.vidaTempo -= delta;
            t.cooldownTiro -= delta;

            if (t.vidaTempo <= 0) {
                if (this.cena) this.cena.remove(t.mesh);
                this.torretas.splice(i, 1);
                continue;
            }

            if (t.cooldownTiro <= 0 && typeof Zumbis !== "undefined" && Zumbis.lista.length > 0) {
                const alvo = Zumbis.lista.find((z) => z.mesh.position.distanceTo(t.mesh.position) <= 22);
                if (alvo) {
                    Zumbis.aplicarDano(alvo, 18);
                    t.cooldownTiro = 0.35;
                }
            }
        }
    }
};