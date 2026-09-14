export const business = {
  name: "Boxline",
  tagline: "Engenharia de embalagem",
  // Substitua estes dados demonstrativos antes de publicar.
  demo: true,
  whatsapp: "5541998206552",
  phone: "(41) 99820-6552",
  email: "vendas@boxline.example",
  address: "São Paulo, SP • Atendimento em todo o Brasil",
  hours: "Segunda a sexta, das 8h às 18h",
  response: "Resposta comercial em até 24h úteis",
  defaultMessage:
    "Olá, Boxline! Quero encontrar a embalagem certa para o meu produto.",
  stats: [
    { value: 80, prefix: "+", suffix: "", label: "modelos de caixas" },
    { value: 100, prefix: "", suffix: "%", label: "projetos sob medida" },
    { value: 5000, prefix: "+", suffix: "", label: "caixas produzidas" },
    { value: 24, prefix: "", suffix: "h", label: "para conversar com vendas" },
  ],
  companies: [
    "Empresa A",
    "Empresa B",
    "Empresa C",
    "Empresa D",
    "Empresa E",
    "Empresa F",
  ],
  postalSizes: [
    {
      name: "Compacta",
      size: [16, 12, 7],
      description: "Para pequenos produtos e acessórios.",
    },
    {
      name: "Essencial",
      size: [20, 15, 10],
      description: "Para cosméticos e kits compactos.",
    },
    {
      name: "Versátil",
      size: [30, 20, 15],
      description: "Para livros, roupas e pedidos do dia a dia.",
    },
    {
      name: "Ampla",
      size: [40, 30, 20],
      description: "Para conjuntos e produtos maiores.",
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
