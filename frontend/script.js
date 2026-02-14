// script.js - Frontend para Loja VIP Nova Era Roleplay
// Gerencia produtos, filtros, navegação e integração com Mercado Pago via backend

// Objeto editável de produtos - FÁCIL DE MODIFICAR: Adicione/remova produtos aqui
// Agora com imagens em PNG
// EDITÁVEL: Adicione 'galeria: ["/assets/imagem1.png", "/assets/imagem2.png"]' para mais imagens na galeria
const products = {
    'vip-bronze': { id: 'vip-bronze', title: 'VIP Bronze', price: 49.90, categoria: 'vips', descricao: 'Acesso básico aos benefícios VIP.', beneficios: ['Salário aumentado em 20%', 'Tag no Discord', 'Acesso a eventos exclusivos'], imagem: '/assets/vip-bronze.png', galeria: ['/assets/vip-bronze.png'] },
    'vip-prata': { id: 'vip-prata', title: 'VIP Prata', price: 79.90, categoria: 'vips', descricao: 'Benefícios intermediários para jogadores ativos.', beneficios: ['Salário dobrado', 'Carro básico incluído', 'Tag personalizada no Discord', 'Acesso a área VIP'], imagem: '/assets/vip-prata.png', galeria: ['/assets/vip-prata.png'] },
    'vip-ouro': { id: 'vip-ouro', title: 'VIP Ouro', price: 99.90, categoria: 'vips', descricao: 'Pacote premium com vantagens avançadas.', beneficios: ['Salário dobrado', 'Carro exclusivo Lamborghini', 'Casa premium', 'Tag personalizada no Discord', 'Acesso a área exclusiva', 'Prioridade em filas'], imagem: '/assets/vip-ouro.png', galeria: ['/assets/vip-ouro.png'] },
    'vip-diamante': { id: 'vip-diamante', title: 'VIP Diamante', price: 149.90, categoria: 'vips', descricao: 'O pacote mais exclusivo para a elite.', beneficios: ['Salário triplicado', 'Garagem com 3 carros premium', 'Mansão luxuosa', 'Tag diamante no Discord', 'Acesso VIP total', 'Suporte prioritário 24/7'], imagem: '/assets/vip-diamante.png', galeria: ['/assets/vip-diamante.png'] },
    'lamborghini-huracan': { id: 'lamborghini-huracan', title: 'Lamborghini Huracán', price: 149.90, categoria: 'veiculos', descricao: 'Carro esportivo de alta performance.', beneficios: ['Velocidade máxima 300km/h', 'Aceleração 0-100 em 3s', 'Personalização completa', 'Incluído em VIP Ouro+'], imagem: '/assets/lamborghini-huracan.png', galeria: ['/assets/lamborghini-huracan.png'] },
    'ferrari-488': { id: 'ferrari-488', title: 'Ferrari 488', price: 199.90, categoria: 'veiculos', descricao: 'Superesportivo italiano icônico.', beneficios: ['Motor V8 turbo', 'Design aerodinâmico', 'Som exclusivo', 'Ideal para corridas'], imagem: '/assets/ferrari-488.png', galeria: ['/assets/ferrari-488.png'] },
    'bmw-m3': { id: 'bmw-m3', title: 'BMW M3', price: 129.90, categoria: 'veiculos', descricao: 'Sedan esportivo alemão.', beneficios: ['Tração traseira', 'Interior premium', 'Modo drift incluído', 'Perfeito para cidade'], imagem: '/assets/bmw-m3.png', galeria: ['/assets/bmw-m3.png'] },
    'pack-roupas': { id: 'pack-roupas', title: 'Pack Roupas Exclusivas', price: 39.90, categoria: 'extras', descricao: 'Roupas temáticas para seu personagem.', beneficios: ['10 skins exclusivas', 'Acessórios premium', 'Compatível com todos os VIPs'], imagem: '/assets/pack-roupas.png', galeria: ['/assets/pack-roupas.png'] },
    'pack-armas-vip': { id: 'pack-armas-vip', title: 'Pack Armas VIP', price: 69.90, categoria: 'extras', descricao: 'Armas raras e poderosas.', beneficios: ['AK-47 dourada', 'Pistola silenciosa', 'Munição infinita', 'Apenas para VIPs'], imagem: '/assets/pack-armas-vip.png', galeria: ['/assets/pack-armas-vip.png'] },
    'casa-premium': { id: 'casa-premium', title: 'Casa Premium', price: 89.90, categoria: 'extras', descricao: 'Residência luxuosa no servidor.', beneficios: ['Localização central', 'Garagem para 2 carros', 'Decoração personalizada', 'Segurança máxima'], imagem: '/assets/casa-premium.png', galeria: ['/assets/casa-premium.png'] }
};

// Função para renderizar produtos
function renderProdutos(filtro = 'todos') {
    const grid = document.getElementById('produtos-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const produtosFiltrados = filtro === 'todos' ? Object.values(products) : Object.values(products).filter(p => p.categoria === filtro);
    console.log('Produtos filtrados:', produtosFiltrados); // Debug
    produtosFiltrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.title}" onerror="console.error('Erro ao carregar imagem do produto:', this.src); this.src='/assets/placeholder.png';">
            <div class="produto-info">
                <h3>${produto.title}</h3>
                <p>${produto.descricao}</p>
                <div class="preco">R$${produto.price.toFixed(2)}</div>
                <button class="btn-comprar" onclick="buyProduct('${produto.id}')">Comprar</button>
                <button class="btn-detalhes" onclick="window.location.href='produto.html?id=${produto.id}'">Ver Detalhes</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Função para filtros
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada, renderizando produtos...'); // Debug
    renderProdutos();
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProdutos(btn.dataset.categoria);
        });
    });

    // Scroll suave para "Ver Loja"
    document.getElementById('ver-loja-btn')?.addEventListener('click', () => {
        document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    });

    // Página de produto individual
    if (window.location.pathname.includes('produto.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');
        console.log('Produto ID da URL:', produtoId); // Debug
        const produto = products[produtoId];
        if (produto) {
            console.log('Produto encontrado:', produto); // Debug
            const galeriaHTML = produto.galeria.map(img => `<img src="${img}" alt="Imagem do produto" onclick="abrirModal('${img}')" onerror="console.error('Erro ao carregar imagem da galeria:', this.src); this.src='/assets/placeholder.png';">`).join('');
            document.getElementById('produto-info').innerHTML = `
                <img src="${produto.imagem}" alt="${produto.title}" onerror="console.error('Erro ao carregar imagem na página de detalhes:', this.src); this.src='/assets/placeholder.png';">
                <h3>${produto.title}</h3>
                <div class="preco">R$${produto.price.toFixed(2)}</div>
                <ul class="beneficios">${produto.beneficios.map(b => `<li>${b}</li>`).join('')}</ul>
                <div class="como-usar">
                    <h4>Como Usar</h4>
                    <p>Edite este texto para explicar como o produto funciona. Por exemplo: "Após a compra, o VIP será ativado em até 24 horas. Use o comando /vip no jogo para verificar."</p>
                </div>
                <div class="galeria-imagens">
                    <h4>Galeria de Imagens</h4>
                    <div class="galeria-thumbnails">${galeriaHTML}</div>
                </div>
                <button id="comprar-produto-btn" onclick="buyProduct('${produto.id}')">Comprar Agora</button>
            `;
        } else {
            console.error('Produto não encontrado:', produtoId); // Debug
            document.getElementById('produto-info').innerHTML = '<p>Produto não encontrado.</p>';
        }
        document.getElementById('voltar-btn').addEventListener('click', () => window.location.href = 'index.html');
    }
});

// Função para comprar produto - Integração com Mercado Pago
async function buyProduct(productKey) {
    const produto = products[productKey];
    if (!produto) {
        alert('Produto não encontrado.');
        return;
    }

    console.log('Iniciando compra para:', produto.title); // Debug

    try {
        const response = await fetch('http://localhost:3000/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: produto.id, title: produto.title, price: produto.price })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resposta do backend:', data); // Debug

        if (data.init_point) {
            console.log('Redirecionando para:', data.init_point); // Debug
            window.location.href = data.init_point; // Redireciona para Mercado Pago
        } else {
            alert('Erro ao processar pagamento: ' + (data.error || 'Resposta inválida'));
        }
    } catch (error) {
        console.error('Erro na compra:', error); // Debug
        alert('Erro de conexão ou no servidor: ' + error.message + '. Verifique se o backend está rodando e o token é válido.');
    }
}

// Funções para Modal da Galeria
function abrirModal(src) {
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-galeria').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-galeria').style.display = 'none';
}