const fs = require('fs');
const path = require('path');

// Lista abrangente de palavras-chave estratégicas para Proteção Veicular em Angra dos Reis e Costa Verde
const itens = [
  {
    titulo: "Proteção Veicular em Angra dos Reis",
    descricao: "Proteja seu carro ou moto em Angra dos Reis com a Loog Proteção Veicular. Cobertura completa contra roubo, furto, colisão e assistência 24h sem análise de perfil."
  },
  {
    titulo: "Associação de Proteção Veicular em Angra dos Reis",
    descricao: "A melhor associação de proteção veicular em Angra dos Reis. Planos acessíveis, indenização 100% da tabela FIPE e suporte 24 horas em todo o Brasil."
  },
  {
    titulo: "Cotação de Proteção Veicular em Angra dos Reis",
    descricao: "Faça sua cotação gratuita de proteção veicular em Angra dos Reis em minutos. Simulação rápida pelo WhatsApp sem consulta ao SPC ou Serasa."
  },
  {
    titulo: "Proteção para Carros em Angra dos Reis",
    descricao: "Cobertura completa para seu automóvel em Angra dos Reis: roubo, furto, batida, terceiros, fenômenos naturais e reboque 24h em todo o território nacional."
  },
  {
    titulo: "Proteção para Motos em Angra dos Reis",
    descricao: "Planos sob medida de proteção para motocicletas em Angra dos Reis. Assistência 24h, guincho, chaveiro e cobertura contra furto e colisão com mensalidade que cabe no bolso."
  },
  {
    titulo: "Proteção Veicular para Uber e 99 em Angra dos Reis",
    descricao: "Proteção veicular para motoristas de aplicativo em Angra dos Reis. Sem análise de condutor, com opção de carro reserva e assistência 24 horas ininterrupta."
  },
  {
    titulo: "Proteção para Veículos de Aplicativo em Angra dos Reis",
    descricao: "Trabalhe tranquilo com seu carro de aplicativo em Angra dos Reis. Proteção veicular sob medida para quem roda todos os dias na cidade e na Rio-Santos."
  },
  {
    titulo: "Proteção para Vans e Utilitários em Angra dos Reis",
    descricao: "Mantenha seu utilitário, van de turismo ou frete protegido em Angra dos Reis. Cobertura completa para veículos comerciais e frotas empresariais."
  },
  {
    titulo: "Guincho 24 Horas em Angra dos Reis",
    descricao: "Precisou de reboque ou guincho 24 horas em Angra dos Reis e rodovia Rio-Santos? Atendimento ágil e socorro mecânico para você e sua família."
  },
  {
    titulo: "Reboque 24 Horas em Angra dos Reis",
    descricao: "Serviço de reboque 24h em Angra dos Reis com cobertura regional e nacional. Conte com nossa central de emergência dia e noite."
  },
  {
    titulo: "Assistência 24 Horas para Carros em Angra dos Reis",
    descricao: "Assistência auto 24h em Angra dos Reis: socorro elétrico e mecânico, troca de pneus, recarga de bateria, chaveiro e hospedagem de emergência."
  },
  {
    titulo: "Rastreador Veicular em Angra dos Reis",
    descricao: "Instalação de rastreador veicular com aplicativo em tempo real e bloqueador em Angra dos Reis. Monitore a localização do seu veículo pelo celular 24h."
  },
  {
    titulo: "Rastreador com Bloqueador em Angra dos Reis",
    descricao: "Mais segurança com rastreamento GPS e bloqueio remoto para carros e motos em Angra dos Reis. Maior índice de recuperação em caso de roubo ou furto."
  },
  {
    titulo: "Seguro Auto Barato em Angra dos Reis",
    descricao: "Procurando alternativa ao seguro tradicional? A proteção veicular em Angra dos Reis oferece até 60% de economia com as mesmas coberturas essenciais."
  },
  {
    titulo: "Proteção Veicular sem Análise de Perfil em Angra dos Reis",
    descricao: "Aqui em Angra dos Reis qualquer motorista habilitado pode dirigir. Sem aumento de preço por idade, gênero, estado civil ou CEP de pernoite."
  },
  {
    titulo: "Proteção Veicular sem Consulta ao SPC e Serasa em Angra dos Reis",
    descricao: "Adesão fácil e sem burocracia em Angra dos Reis. Não consultamos SPC ou Serasa. Proteja seu veículo hoje mesmo com vistoria 100% digital."
  },
  {
    titulo: "Proteção contra Roubo e Furto em Angra dos Reis",
    descricao: "Proteja seu patrimônio contra furto e roubo qualificado em Angra dos Reis. Indenização ágil e suporte jurídico completo para associados."
  },
  {
    titulo: "Proteção contra Colisão e Batida em Angra dos Reis",
    descricao: "Bateu o carro em Angra dos Reis? Conte com reparo em oficinas credenciadas de primeira linha ou indenização integral conforme a Tabela FIPE."
  },
  {
    titulo: "Proteção contra Terceiros em Angra dos Reis",
    descricao: "Cobertura de danos materiais e corporais a terceiros em Angra dos Reis. Evite prejuízos em acidentes com indenização garantida pela Loog."
  },
  {
    titulo: "Proteção contra Perda Total em Angra dos Reis",
    descricao: "Cobertura de perda total com indenização de até 100% da Tabela FIPE para veículos protegidos pela Loog em Angra dos Reis."
  },
  {
    titulo: "Proteção contra Fenômenos da Natureza em Angra dos Reis",
    descricao: "Proteção contra enchentes, alagamentos, queda de árvores e chuvas de granizo em Angra dos Reis e região da Costa Verde."
  },
  {
    titulo: "Proteção contra Incêndio em Angra dos Reis",
    descricao: "Cobertura completa em caso de incêndio, explosão e danos derivados no seu veículo em Angra dos Reis e em qualquer estrada do Brasil."
  },
  {
    titulo: "Carro Reserva em Angra dos Reis",
    descricao: "Não fique a pé se precisar de reparos. Planos de proteção veicular com opção de carro reserva de 7, 15 ou 30 dias em Angra dos Reis."
  },
  {
    titulo: "Socorro Mecânico e Troca de Pneus em Angra dos Reis",
    descricao: "Pneu furou ou o carro não liga em Angra dos Reis? Chame nossa assistência 24h e receba atendimento profissional no local rapidamente."
  },
  {
    titulo: "Chaveiro 24 Horas Veicular em Angra dos Reis",
    descricao: "Chave trancada dentro do carro ou perda da chave em Angra dos Reis? Nosso serviço de chaveiro 24 horas resolve seu problema com agilidade."
  },
  {
    titulo: "Proteção Veicular no Centro de Angra dos Reis",
    descricao: "Atendimento presencial e digital para associados no Centro de Angra dos Reis. Cotação rápida e vistoria no mesmo dia."
  },
  {
    titulo: "Proteção Veicular em Japuíba Angra dos Reis",
    descricao: "A melhor proteção veicular para moradores e comerciantes de Japuíba em Angra dos Reis. Cobertura completa e assistência 24h pertinho de você."
  },
  {
    titulo: "Proteção Veicular em Jacuecanga Angra dos Reis",
    descricao: "Proteja seu veículo em Jacuecanga, Angra dos Reis. Ideal para trabalhadores dos estaleiros e polo naval com mensalidade super acessível."
  },
  {
    titulo: "Proteção Veicular no Frade Angra dos Reis",
    descricao: "Planos especiais de proteção veicular no bairro do Frade em Angra dos Reis. Cobertura de alto padrão e reboque 24h na Rio-Santos."
  },
  {
    titulo: "Proteção Veicular no Bracuí Angra dos Reis",
    descricao: "Segurança e tranquilidade para motoristas e barcos/trailers no Bracuí, Angra dos Reis. Cobertura 24 horas e reboque imediato."
  },
  {
    titulo: "Proteção Veicular na Monsuaba Angra dos Reis",
    descricao: "Adesão de proteção veicular para moradores da Monsuaba em Angra dos Reis. Simulação online rápida com atendimento humanizado."
  },
  {
    titulo: "Proteção Veicular em Paraty",
    descricao: "Cobertura veicular completa para a histórica cidade de Paraty e arredores. Assistência 24h em toda a Costa Verde e estradas interestaduais."
  },
  {
    titulo: "Proteção Veicular em Mangaratiba",
    descricao: "Proteção veicular completa em Mangaratiba, Conceição de Jacareí e Muriqui. Cobertura contra roubo, batida e assistência 24 horas."
  },
  {
    titulo: "Proteção Veicular na Rio-Santos BR-101",
    descricao: "Viaje com total tranquilidade pela rodovia Rio-Santos BR-101 com o apoio da assistência 24h e reboque da Loog Angra."
  },
  {
    titulo: "Proteção Veicular em Conceição de Jacareí",
    descricao: "Proteja seu carro ou moto em Conceição de Jacareí com cobertura completa contra roubo, colisão e assistência 24 horas."
  },
  {
    titulo: "Proteção Veicular para Frotas em Angra dos Reis",
    descricao: "Gerencie e proteja a frota da sua empresa em Angra dos Reis. Tarifas corporativas exclusivas, telemetria e atendimento prioritário."
  },
  {
    titulo: "Proteção Veicular para Caminhonetes em Angra dos Reis",
    descricao: "Planos dedicados para caminhonetes e picapes 4x4 em Angra dos Reis. Cobertura total para quem utiliza o veículo na cidade ou na serra."
  },
  {
    titulo: "Proteção Veicular para Jovens Motoristas em Angra dos Reis",
    descricao: "Sem cobrança abusiva para jovens condutores. Na Loog Angra o preço é justo independente de quem estiver no volante."
  },
  {
    titulo: "Proteção para Motoboys e Delivery em Angra dos Reis",
    descricao: "Trabalha com entregas em Angra dos Reis? Proteja sua moto contra roubo, furto e acidentes com mensalidade que não pesa na sua renda."
  },
  {
    titulo: "Proteção de Vidros Faróis e Retrovisores em Angra dos Reis",
    descricao: "Troca e reparo de para-brisas, faróis, lanternas e retrovisores sem complicações para associados da Loog em Angra dos Reis."
  },
  {
    titulo: "Vistoria Digital Proteção Veicular em Angra dos Reis",
    descricao: "Proteja seu veículo sem sair de casa. Vistoria 100% digital por fotos e aprovação rápida em Angra dos Reis."
  },
  {
    titulo: "Melhor Proteção Veicular de Angra dos Reis",
    descricao: "Descubra por que a Loog é a proteção veicular mais recomendada em Angra dos Reis. Transparência, solidez e assistência que funciona quando você precisa."
  },
  {
    titulo: "Simulação de Seguro Veicular em Angra dos Reis",
    descricao: "Quer saber quanto custa proteger seu veículo em Angra dos Reis? Faça uma simulação rápida no WhatsApp e compare a economia."
  },
  {
    titulo: "Clube de Benefícios Automotivo em Angra dos Reis",
    descricao: "Além da proteção completa, associados da Loog contam com clube de descontos em combustível, farmácias, oficinas e parceiros em Angra dos Reis."
  },
  {
    titulo: "Hospedagem Emergencial em Angra dos Reis",
    descricao: "Ficou na mão durante uma viagem longe de casa? Nossa assistência 24h cobre hospedagem emergencial para motorista e passageiros."
  },
  {
    titulo: "Proteção Veicular para Carros Antigos em Angra dos Reis",
    descricao: "Carros com mais de 10 ou 15 anos também merecem proteção. Na Loog aceitamos veículos de diversos anos sem burocracia."
  },
  {
    titulo: "Auxílio Pane Seca em Angra dos Reis",
    descricao: "Acabou o combustível no meio do trajeto em Angra dos Reis? Nossa assistência 24h leva combustível ou reboca seu carro até o posto mais próximo."
  },
  {
    titulo: "Proteção Veicular para Táxi em Angra dos Reis",
    descricao: "Condições especiais e atendimento ágil para taxistas de Angra dos Reis, garantindo que seu instrumento de trabalho não fique parado."
  },
  {
    titulo: "Adesão Imediata de Proteção Veicular em Angra dos Reis",
    descricao: "Ative a proteção do seu carro ou moto hoje mesmo. Processo de adesão simples, 100% online e suporte dedicado em Angra dos Reis."
  },
  {
    titulo: "Cobertura Nacional de Proteção Veicular Angra dos Reis",
    descricao: "Mora em Angra dos Reis mas viaja pelo Brasil? Sua proteção veicular te acompanha em todo o território nacional 24 horas por dia."
  }
];

// Pasta de saída para as páginas markdown de keywords
const outputDir = path.resolve(__dirname, 'keywords');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Função para gerar slug/permalink amigável para SEO
function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // troca espaços por hífens
    .replace(/-+/g, '-'); // remove hífens duplicados
}

// Gerar arquivos markdown
console.log(`🚀 Gerando ${itens.length} páginas de SEO local em: ${outputDir}`);
let count = 0;

itens.forEach(item => {
  const slug = slugify(item.titulo);
  const content = `---
title: "${item.titulo}"
description: "${item.descricao}"
layout: "home.html"
permalink: "/${slug}/"
---`;

  const filename = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(filename, content, 'utf8');
  count++;
});

console.log(`✅ Concluído com sucesso! ${count} páginas geradas.`);
