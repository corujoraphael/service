#!/bin/bash
# ============================================================
# processar-imagem.sh
# Processa automaticamente imagens NOVAS na pasta imgs/:
#   1. Remove TODOS os metadados anteriores (inclusive tags de IA)
#   2. Adiciona metadados de localização de Angra dos Reis - RJ
#   3. Converte para WebP otimizado (quality 82)
#   4. Reinjeta metadados geográficos no WebP gerado
#
# Uso:
#   ./scripts/processar-imagem.sh
#   ou: npm run process-images
#
# Dependências: exiftool, imagemagick (convert)
# ============================================================

set -e

# Pasta das imagens
IMGS_DIR="imgs"

# Coordenadas geográficas de Angra dos Reis, RJ
LAT="-23.0067"
LAT_REF="S"
LON="-44.3181"
LON_REF="W"
CITY="Angra dos Reis"
STATE="Rio de Janeiro"
COUNTRY="Brazil"

# Qualidade WebP (equilíbrio ideal entre fidelidade visual e tamanho reduzido)
QUALITY=82

# Cores para formatação no terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar dependências do sistema
check_deps() {
  local missing=0
  if ! command -v exiftool &> /dev/null; then
    echo -e "${RED}✗ exiftool não encontrado. Instale: sudo apt install libimage-exiftool-perl${NC}"
    missing=1
  fi
  if ! command -v convert &> /dev/null; then
    echo -e "${RED}✗ ImageMagick não encontrado. Instale: sudo apt install imagemagick${NC}"
    missing=1
  fi
  if [ $missing -eq 1 ]; then
    echo -e "${YELLOW}Dica: em sistemas Debian/Ubuntu execute: sudo apt update && sudo apt install -y imagemagick libimage-exiftool-perl${NC}"
    exit 1
  fi
}

# Criar pasta imgs caso não exista
if [ ! -d "$IMGS_DIR" ]; then
  mkdir -p "$IMGS_DIR"
fi

# Processar uma imagem específica
processar() {
  local arquivo="$1"
  local dir=$(dirname "$arquivo")
  local nome=$(basename "$arquivo")
  local nome_sem_ext="${nome%.*}"
  local webp_saida="${dir}/${nome_sem_ext}.webp"

  echo -e "${YELLOW}▶ Processando:${NC} $nome"

  # 1. Remover todos os metadados existentes
  exiftool -overwrite_original -all= "$arquivo" 2>/dev/null
  echo -e "  ${GREEN}✓${NC} Metadados antigos removidos"

  # 2. Adicionar metadados de localização de Angra dos Reis
  exiftool -overwrite_original \
    -GPSLatitude="$LAT" -GPSLatitudeRef="$LAT_REF" \
    -GPSLongitude="$LON" -GPSLongitudeRef="$LON_REF" \
    -City="$CITY" \
    -State="$STATE" \
    -Country="$COUNTRY" \
    -XMP:City="$CITY" \
    -XMP:State="$STATE" \
    -XMP:Country="$COUNTRY" \
    "$arquivo" 2>/dev/null
  echo -e "  ${GREEN}✓${NC} Localização adicionada ($CITY, $STATE)"

  # 3. Converter para formato WebP
  convert "$arquivo" -quality $QUALITY "$webp_saida"
  echo -e "  ${GREEN}✓${NC} WebP gerado: $(basename "$webp_saida")"

  # 4. Adicionar metadados de localização no arquivo WebP
  exiftool -overwrite_original \
    -GPSLatitude="$LAT" -GPSLatitudeRef="$LAT_REF" \
    -GPSLongitude="$LON" -GPSLongitudeRef="$LON_REF" \
    -XMP:City="$CITY" \
    -XMP:State="$STATE" \
    -XMP:Country="$COUNTRY" \
    "$webp_saida" 2>/dev/null
  echo -e "  ${GREEN}✓${NC} Metadados salvos no WebP"

  echo ""
}

# Início da execução
check_deps

echo ""
echo "🚗 Processador de Imagens e SEO Geográfico - Loog Angra"
echo "========================================================"
echo "Buscando imagens novas (.jpeg, .jpg, .png) em ${IMGS_DIR}/..."
echo "Geolocalização: $CITY, $STATE ($LAT, $LON)"
echo ""

count=0

# Percorrer imagens na pasta imgs
shopt -s nullglob
for arquivo in "$IMGS_DIR"/*.jpeg "$IMGS_DIR"/*.jpg "$IMGS_DIR"/*.png; do
  [ -f "$arquivo" ] || continue

  nome=$(basename "$arquivo")
  nome_sem_ext="${nome%.*}"
  webp_esperado="$IMGS_DIR/${nome_sem_ext}.webp"

  # Pular caso já exista a versão WebP
  if [ -f "$webp_esperado" ]; then
    continue
  fi

  processar "$arquivo"
  ((count++))
done

echo "========================================================"
if [ $count -eq 0 ]; then
  echo -e "${GREEN}✓ Nenhuma imagem pendente para processar.${NC}"
else
  echo -e "${GREEN}✓ $count imagem(ns) processada(s) com sucesso em WebP!${NC}"
fi
