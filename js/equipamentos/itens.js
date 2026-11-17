/* ==========================================================================
   js/equipamentos/itens.js - Suprimentos, Puzzles, Caixa de Munição e Torretas
   ========================================================================== */

const Itens = {
    ativos: [],       // Itens espalhados no chão ou implantados (torretas/caixas)
    fusiveisColetados: 0,
    chavesColetadas: 0,

    limparTudo(cena) {
        if (cena) {
            this.ativos.forEach(item => {
                if (item.mesh) cena.remove(item.mesh);
            });
        }
        this.ativos = [];
        this.fusiveisColetados = 0;
        this.chavesColetadas = 0;
    },

    // Cria um item coletável no mapa (kit_medico, pilulas, municao, fusivel, chave, arma)
    criarItemChao(tipo, x, y, z, dadosExtras = {}) {
        if (typeof MotorJogo === "undefined" || !MotorJogo.cena) return null;

        let cor = 0xffffff;
        let tamanho = new THREE.Vector3(0.55, 0.35, 0.55);

        if (tipo === "kit_medico") {
            cor = 0xff3b3b; // Vermelho com cruz branca
        } else if (tipo === "pilulas") {
            cor = 0xff9f43; // Laranja (recupera vida + estamina)
            tamanho.set(0.32, 0.42, 0.32);
        } else if (tipo === "municao") {
            cor = 0x2ecc71; // Verde militar
        } else if (tipo === "fusivel") {
            cor = 0xf1c40f; // Amarelo brilhante (item de puzzle)
            tamanho.set(0.28, 0.5, 0.28);
        } else if (tipo === "chave") {
            cor = 0x00d2ff; // Ciano neon (item de puzzle)
            tamanho.set(0.4, 0.2, 0.2);
        } else if (tipo === "arma_chao") {
            cor = 0x9b59b6; // Roxo para caixas de armas raras
            tamanho.set(0.9, 0.3, 0.4);
        }

        const geo = new THREE.BoxGeometry(tamanho.x, tamanho.y, tamanho.z);
        const mat = new THREE.MeshLambertMaterial({ color: cor });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y + 0.35, z);

        MotorJogo.cena.add(mesh);

        const item = {
            tipo,
            mesh,
            posicao: mesh.position,
            coletavel: true,
            dadosExtras,
            tempoVida: null
        };

        this.ativos.push(item);
        return item;
    },

    // Habilidade do Luan (Tecla Q): Solta uma Caixa de Munição no chão
    criarCaixaMunicao(posicaoJogador) {
        if (typeof MotorJogo === "undefined" || !MotorJogo.cena) return;

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.45, 0.55),
            new THREE.MeshLambertMaterial({ color: 0x27ae60 })
        );
        mesh.position.set(posicaoJogador.x, 0.25, posicaoJogador.z - 1.2);
        MotorJogo.cena.add(mesh);

        this.ativos.push({
            tipo: "caixa_luan",
            mesh,
            posicao: mesh.position,
            coletavel: true,
            usosRestantes: 4, // Até 4 jogadores podem reabastecer
            tempoVida: 45
        });

        console.log("Luan implantou uma Caixa de Munição!");
    },

    // Passiva do Luan (A cada 20 Kills): Constrói uma Torreta Automática SENAI
    criarTorreta(posicaoJogador, duracaoSeg = 25) {
        if (typeof MotorJogo === "undefined" || !MotorJogo.cena) return;

        const grupo = new THREE.Group();

        // Tripé / Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.5, 0.7, 8),
            new THREE.MeshLambertMaterial({ color: 0x2c3e50 })
        );
        base.position.y = 0.35;

        // Cabeça giratória e cano
        const cabeca = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.35, 0.65),
            new THREE.MeshLambertMaterial({ color: 0xe74c3c })
        );
        cabeca.position.y = 0.85;

        const cano = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8),
            new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        cano.rotation.x = Math.PI / 2;
        cano.position.set(0, 0.85, -0.45);

        grupo.add(base, cabeca, cano);
        grupo.position.set(posicaoJogador.x + 1.2, 0, posicaoJogador.z - 1.2);
        MotorJogo.cena