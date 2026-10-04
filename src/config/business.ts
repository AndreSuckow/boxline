export const business = {
  name: "BoxLyne",
  tagline: "Engenharia de embalagem",
  whatsapp: "5541998206552",
  phone: "(41) 99820-6552",
  email: "andre@boxlyne.com.br",
  address: "Curitiba, Campo Largo e regiões metropolitanas próximas",
  hours: "Segunda a sexta, das 8h às 18h",
  response: "Resposta comercial em até 24h úteis",
  defaultMessage:
    "Olá, BoxLyne! Quero encontrar a embalagem certa para o meu produto.",
  stats: [
    { value: 80, prefix: "+", suffix: "", label: "modelos de caixas" },
    { value: 100, prefix: "", suffix: "%", label: "projetos sob medida" },
    { value: 100000, prefix: "+", suffix: "", label: "caixas produzidas" },
    { value: 24, prefix: "", suffix: "h", label: "para conversar com vendas" },
  ],
  // C x L x A em cm, convertidos da referência em mm fornecida pelo cliente.
  // Limites PAC/SEDEX: https://www2.correios.com.br/sistemas/precosprazos/Formato.cfm
  postalSizes: [
    {
      name: "Modelo 01",
      size: [22, 14, 4],
      description: "Formato raso para itens de pouca altura.",
    },
    {
      name: "Modelo 02",
      size: [18, 11.5, 5],
      description: "Formato estreito para pequenos itens.",
    },
    {
      name: "Modelo 03",
      size: [22.5, 19, 6],
      description: "Formato baixo com base mais larga.",
    },
    {
      name: "Modelo 04",
      size: [17, 12.5, 7.5],
      description: "Formato compacto com mais altura.",
    },
  ],
  products: [
    {
      id: "ecommerce",
      title: "E-commerce",
      tag: "DO SEU ESTOQUE AO CLIENTE",
      description: "Praticidade no fechamento. Cuidado em cada entrega.",
      dimensions: "16 × 12 × 7 cm",
      size: [16, 12, 7],
      style: "mailer",
    },
    {
      id: "transporte",
      title: "Transporte",
      tag: "PRONTA PARA O CAMINHO",
      description: "Estrutura para a logística e o armazenamento do dia a dia.",
      dimensions: "40 × 30 × 30 cm",
      size: [40, 30, 30],
      style: "tall",
    },
    {
      id: "sobmedida",
      title: "Sob medida",
      tag: "CADA MILÍMETRO IMPORTA",
      description: "O encaixe certo para o produto. Menos espaço desperdiçado.",
      dimensions: "Suas medidas. Sua solução.",
      size: [30, 20, 15],
      style: "custom",
    },
    {
      id: "personalizada",
      title: "Personalizadas",
      tag: "SUA MARCA VAI JUNTO",
      description: "Uma embalagem que protege e apresenta a sua marca.",
      dimensions: "Impressão e formatos especiais",
      size: [25, 20, 12],
      style: "print",
    },
  ],
} as const;
export function whatsappUrl(message: string = business.defaultMessage) {
  return (
    "https://wa.me/" +
    business.whatsapp.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(message)
  );
}
