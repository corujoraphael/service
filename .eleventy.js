const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { minify: terserMinify } = require("terser");
const { PurgeCSS } = require("purgecss");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Passthrough copy de pastas estáticas para o diretório de build
  eleventyConfig.addPassthroughCopy("./imgs");
  eleventyConfig.addPassthroughCopy("./fonts");
  eleventyConfig.addPassthroughCopy("./_headers");
  eleventyConfig.addPassthroughCopy("./styles");
  eleventyConfig.addPassthroughCopy("./js");

  // PurgeCSS + Minify CSS após o build do Eleventy
  eleventyConfig.on("eleventy.after", async () => {
    const cssDir = "_site/styles";
    if (fs.existsSync(cssDir)) {
      const files = fs.readdirSync(cssDir).filter(f => f.endsWith(".css"));
      for (const file of files) {
        const filePath = path.join(cssDir, file);
        try {
          const purged = await new PurgeCSS().purge({
            content: ["_site/**/*.html"],
            css: [filePath],
            safelist: {
              standard: [/active/, /visible/, /fade-in/, /open/, /show/, /accordion/, /guide/],
              greedy: [/plan-card/, /filter-btn/, /testimonial/, /badge/, /modal/, /faq/, /guide/, /regiao/, /consultor/]
            }
          });
          const purgedCSS = purged.length ? purged[0].css : fs.readFileSync(filePath, "utf8");
          const output = new CleanCSS({ level: 2 }).minify(purgedCSS);
          if (output.styles) {
            fs.writeFileSync(filePath, output.styles);
          }
        } catch (err) {
          console.warn(`[PurgeCSS/CleanCSS] Aviso ao processar ${file}:`, err.message);
        }
      }
    }
  });

  // Minificar arquivos JavaScript após o build
  eleventyConfig.on("eleventy.after", async () => {
    const jsDir = "_site/js";
    if (fs.existsSync(jsDir)) {
      const files = fs.readdirSync(jsDir).filter(f => f.endsWith(".js"));
      for (const file of files) {
        const filePath = path.join(jsDir, file);
        try {
          const input = fs.readFileSync(filePath, "utf8");
          const output = await terserMinify(input);
          if (output.code) {
            fs.writeFileSync(filePath, output.code);
          }
        } catch (err) {
          console.warn(`[Terser] Aviso ao minificar ${file}:`, err.message);
        }
      }
    }
  });

  // Minificação de HTML em tempo de compilação
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      });
    }
    return content;
  });

  // Coleção de Planos de Proteção Veicular
  eleventyConfig.addCollection("planos", function (collectionApi) {
    return collectionApi.getFilteredByGlob("planos/*.md");
  });

  // Coleção de Guias Informativos e Conteúdo de Apoio
  eleventyConfig.addCollection("guias", function (collectionApi) {
    return collectionApi.getFilteredByGlob("guias/*.md");
  });

  // Coleção de Páginas Regionais Estratégicas
  eleventyConfig.addCollection("regioes", function (collectionApi) {
    return collectionApi.getFilteredByGlob("regioes/*.md");
  });

  // Filtros utilitários
  eleventyConfig.addFilter("limit", (arr, limit) => (Array.isArray(arr) ? arr.slice(0, limit) : []));

  eleventyConfig.addFilter("today", () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  eleventyConfig.addFilter("orderByDate", function (array, order = "desc") {
    if (!Array.isArray(array)) return [];
    function parseDate(str) {
      if (!str) return new Date(0);
      const parts = str.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
      return new Date(str);
    }
    return array.slice().sort((a, b) => {
      const dateA = parseDate(a?.data?.data || "");
      const dateB = parseDate(b?.data?.data || "");
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  });

  eleventyConfig.addFilter("uniqueCategories", function (collection) {
    if (!Array.isArray(collection)) return [];
    const categories = collection
      .map(item => item.data && item.data.type)
      .filter(Boolean);
    return [...new Set(categories)];
  });

  eleventyConfig.addFilter("priceNumber", function (priceStr) {
    if (!priceStr) return "0.00";
    const cleaned = String(priceStr).replace(/[^\d,\.]/g, "");
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  });

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
