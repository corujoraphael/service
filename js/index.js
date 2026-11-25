// ============================================================
// LOOG Proteção Veicular — Scripts de Interação & Conversão
// WhatsApp Oficial: 24 99881-4288
// ============================================================

const WHATSAPP_NUMBER = '5524998814288';

// Menu mobile toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-menu');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', expanded);
    });

    // Fechar menu ao clicar em um link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Atualizar ano dinâmico no footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// Envio do Simulador Principal da Home direto para o WhatsApp
function enviarSimuladorHome(e) {
  e.preventDefault();

  const nome = document.getElementById('sim-nome')?.value.trim() || '';
  const tipo = document.getElementById('sim-tipo')?.value || '';
  const veiculo = document.getElementById('sim-veiculo')?.value.trim() || '';
  const cidade = document.getElementById('sim-cidade')?.value.trim() || 'Angra dos Reis';

  const mensagem = 
    `Olá! Gostaria de uma cotação da LOOG para meu veículo:\n` +
    `• Nome: ${nome}\n` +
    `• Categoria: ${tipo}\n` +
    `• Veículo/Ano: ${veiculo}\n` +
    `• Localização: ${cidade}\n\n` +
    `Vim pelo site oficial e gostaria de saber os valores e coberturas!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

  if (typeof trackWhatsAppClick === 'function') {
    trackWhatsAppClick('simulador_home', tipo);
  }

  window.open(url, '_blank');
}

// Envio do Simulador das Páginas Regionais direto para o WhatsApp
function enviarSimuladorRegiao(e) {
  e.preventDefault();
  const form = e.target;
  const nome = form.querySelector('.reg-sim-nome')?.value.trim() || '';
  const tipo = form.querySelector('.reg-sim-tipo')?.value || 'Carro';
  const veiculo = form.querySelector('.reg-sim-veiculo')?.value.trim() || '';
  const regiao = form.querySelector('.reg-sim-cidade')?.value.trim() || 'Costa Verde';

  const mensagem = 
    `Olá! Gostaria de uma cotação da LOOG para meu veículo:\n` +
    `• Nome: ${nome}\n` +
    `• Categoria: ${tipo}\n` +
    `• Veículo/Ano: ${veiculo}\n` +
    `• Região: ${regiao}\n\n` +
    `Vim pela página de ${regiao} e gostaria de consultar valores e coberturas!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

  if (typeof trackWhatsAppClick === 'function') {
    trackWhatsAppClick('simulador_regiao', `${regiao}_${tipo}`);
  }

  window.open(url, '_blank');
}

// Envio da Cotação Rápida do Rodapé direto para o WhatsApp
function enviarCotacaoWhatsApp(e) {
  e.preventDefault();

  const nome = document.getElementById('footer-nome')?.value.trim() || '';
  const veiculo = document.getElementById('footer-veiculo')?.value.trim() || '';

  const mensagem = 
    `Olá! Gostaria de receber uma cotação rápida da LOOG:\n` +
    `• Nome: ${nome}\n` +
    `• Veículo: ${veiculo}\n\n` +
    `Vim pelo rodapé do site e aguardo o retorno!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

  if (typeof trackWhatsAppClick === 'function') {
    trackWhatsAppClick('footer_form', 'cotacao_express');
  }

  window.open(url, '_blank');
}

// Rastreamento seguro de conversão para analytics (GTM dataLayer e GA4 gtag)
function trackWhatsAppClick(origem, detalhe) {
  try {
    // Envio para GTM dataLayer
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({
        event: 'whatsapp_click',
        event_category: 'Conversao',
        origem: origem || 'geral',
        detalhe: detalhe || 'whatsapp',
        numero: WHATSAPP_NUMBER
      });
    }

    // Envio para Google Analytics 4 (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'WhatsApp',
        event_label: `${origem || 'geral'}_${detalhe || 'whatsapp'}`,
        value: 1
      });
    }
  } catch (err) {
    // Silencia qualquer exceção de tracking para nunca bloquear o usuário
    console.debug('Analytics tracking info:', err);
  }
}

// Captura UTMs / ref para identificar qual anúncio ou influencer gerou o lead
function getLPUtmTag() {
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || params.get('ref') || '';
    const campaign = params.get('utm_campaign') || '';
    const parts = [source, campaign].filter(Boolean);
    return parts.length ? parts.join(' / ') : '';
  } catch {
    return '';
  }
}

function trackLPWhatsApp(origem, detalhe) {
  const utm = getLPUtmTag();
  trackWhatsAppClick(origem, utm ? `${detalhe}_${utm}` : detalhe);
}

function enviarSimuladorLP(e) {
  e.preventDefault();

  const nome = document.getElementById('lp-nome')?.value.trim() || '';
  const tipo = document.getElementById('lp-tipo')?.value || '';
  const veiculo = document.getElementById('lp-veiculo')?.value.trim() || '';
  const utm = getLPUtmTag();

  let mensagem =
    `Olá! Vi a oferta da LOOG (a partir de R$ 34,90/mês) e quero cotar meu veículo:\n` +
    `• Nome: ${nome}\n` +
    `• Categoria: ${tipo}\n` +
    `• Veículo/Ano: ${veiculo}`;

  if (utm) {
    mensagem += `\n• Campanha/Indicação: ${utm}`;
  }

  trackLPWhatsApp('lp_simulador', tipo);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
