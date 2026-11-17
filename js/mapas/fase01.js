/* ==========================================================================
   js/mapas/fase01.js - Fase 01: Terreno Baldio do Jardim Novo Mundo (10 Min)
   ========================================================================== */

const MapaFase01 = {
    timerSobrevivencia: 600, // 10 minutos (600 segundos)
    timerOnda: 0,
    ondasLancadas: 0,
    intervaloUpdate: null,

    construir(cena) {
        this.limparTimers();
        this.timerSobrevivencia = 600;
        this.timerOnda = 0;
        this.ondasLancadas = 0;

        // Céu e neblina de fim de tarde no Jardim Novo Mundo
        cena.background = new THREE.Color(0x4a3b32);
        cena.fog = new THREE.FogExp2(0x4a3b32, 0.012);

        // Chão de terra batida e mato (Terreno baldio semi-aberto)
        const chao = new THREE.Mesh(
            new THREE.PlaneGeometry(110, 110),
            new THREE.MeshLambertMaterial({ color: 0x4d4436 })
        );
        chao.rotation.x = -Math.PI / 2;
        cena.add(chao);

        // Muros baixos e poucas casas de tijolo aparente nas bordas (Favela)
        const posCasas = [
            { x: -32, z: -28 }, { x: 32, z: -25 },
            { x: -34, z: 24 },  { x: 30, z: 28 },
            { x: 0, z: -38 }
        ];
        posCasas.forEach((pos) => {
            if (typeof PecaPredios !== "undefined") {
                PecaPredios.criarCasaFavela(cena, pos.x, pos.z, 8, 4.2, 8);
            } else {
                const casa = new THREE.Mesh(
                    new THREE.BoxGeometry(8, 4.2, 8),
                    new THREE.MeshLambertMaterial({ color: 0x8c4a32 })
                );
                casa.position.set(pos.x, 2.1, pos.z);
                cena.add(casa);
            }
        });

        // Entulhos, pilhas de tijolos e carros velhos para cobertura/parkour
        for (let i = 0; i < 14; i++) {
            const ang = (i / 14) * Math.PI * 2;
            const raio = 14 + (i % 3) * 7;
            const cx = Math.cos(ang) * raio;
            const cz = Math.sin(ang) * raio;

            const entulho = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 1.3, 2.2),
                new THREE.MeshLambertMaterial({ color: 0x6e6a63 })
            );
            entulho.position.set(cx, 0.65, cz);
            cena.add(entulho);
        }

        // Suprimentos iniciais pelo terreno
        if (typeof Itens !== "undefined") {
            Itens.spawnarPickup(cena, "municao", -10, -10);
            Itens.spawnarPickup(cena, "municao", 12, 10);
            Itens.spawnarPickup(cena, "kit_medico", -22, 15);
            Itens.spawnarPickup(cena, "kit_medico", 22, -15);
        }

        // Horda inicial leve para aquecimento
        if (typeof Zumbis !== "undefined") {
            Zumbis.gerarHorda(8, { minX: -25, maxX: 25, minZ: -25, maxZ: 25 });
        }

        // Inicia o cronômetro de 10 minutos e ondas de ~20 zumbis a cada 2 minutos (120s)
        this.intervaloUpdate = setInterval(() => {
            if (typeof MotorJogo === "undefined" || MotorJogo.pausado || !MotorJogo.emExecucao) return;
            if (GameConfig.faseAtual !== 1) {
                this.limparTimers();
                return;
            }

            this.timerSobrevivencia--;
            this.timerOnda++;

            const min = String(Math.floor(this.timerSobrevivencia / 60)).padStart(2, "0");
            const seg = String(this.timerSobrevivencia % 60).padStart(2, "0");
            const elObj = document.getElementById("hud-objetivo");
            if (elObj) {
                elObj.textContent = `⏳ Sobreviva no Terreno Baldio: ${min}:${seg} | Onda ${this.ondasLancadas}/4`;
            }

            // A cada 2 minutos (120s) spawna ~20 zumbis
            if (this.timerOnda >= 120 && this.ondasLancadas < 4) {
                this.timerOnda = 0;
                this.ondasLancadas++;

                if (typeof Zumbis !== "undefined") {
                    Zumbis.gerarHorda(20, { minX: -38, maxX: 38, minZ: -38, maxZ: 38 });
                    // Na 4ª onda (aos 8 minutos) entra o Mini-Boss final
                    if (this.ondasLancadas === 4) {
                        Zumbis.spawnar("tanker", 0, 0, -34);
                    }
                }
            }

            // Ao completar os 10 minutos, libera a saída para o Hub da Fase 02
            if (this.timerSobrevivencia <= 0) {
                this.limparTimers();
                alert("✅ Você sobreviveu aos 10 minutos! Caminho liberado para o Labirinto do Jardim Novo Mundo (Fase 02).");
                MotorJogo.concluirFaseAtual(2);
            }
        }, 1000);
    },

    limparTimers() {
        if (this.intervaloUpdate) {
            clearInterval(this.intervaloUpdate);
            this.intervaloUpdate = null;
        }
    }
};