export class SetupHeroTableCenter {
    private heroStock: LineStock<any>;
    // Guardamos las selecciones actuales
    private selections: { [key: string]: number | null } = { A: null, B: null, C: null };

    constructor(private game: any, private args: any) {
        this.heroStock = this.initHeroStock();
    }

    private initHeroStock(): LineStock<any> {
        const gridElement = document.getElementById('hero-selection-grid');

        if (!gridElement) {
            throw new Error("No se encontró el contenedor #hero-selection-grid");
        }

        const stock = new LineStock<any>(this.game.cardsManager, gridElement, {
            gap: '20px',
            center: true,
        });

        // Los datos vienen del back-end como 'heroes' (argSelectHeroes)
        // Formato: [{ hero_id: 1, card_id: 1, type: 'A' }, ...]
        const heroes = this.args.heroes || [];

        // Convertir al formato que espera LineStock
        const stockCards = heroes.map((hero: any) => ({
            id: hero.card_id,
            type: 'hero',
            type_arg: hero.hero_id,
            location: 'deck',
            location_arg: 0,
            // Agregar el tipo para la lógica de selección
            ...hero
        }));

        stock.addCards(stockCards);

        stock.onCardClick = (hero: any) => {
            this.handleHeroClick(hero);
        };

        return stock;
    }

    private handleHeroClick(hero: any) {
        const type = hero.type; // 'A', 'B' o 'C'

        // Lógica de reemplazo automático
        if (this.selections[type] === hero.card_id) {
            this.selections[type] = null;
        } else {
            this.selections[type] = hero.card_id;
        }

        this.refreshVisuals();
    }

    private refreshVisuals() {
        const selectedIds = Object.values(this.selections).filter(id => id !== null);

        this.heroStock.getCards().forEach((hero: any) => {
            const cardDiv = this.heroStock.getCardElement(hero);
            const isSelected = selectedIds.includes(hero.card_id);
            const isSameTypeButNotSelected = this.selections[hero.type] !== null && !isSelected;

            cardDiv.classList.toggle('selected', isSelected);
            cardDiv.classList.toggle('dimmed', isSameTypeButNotSelected);
        });

        // Actualizar indicadores de tipo (A, B, C)
        ['A', 'B', 'C'].forEach(type => {
            const indicator = document.getElementById(`indicator-${type}`);
            if (indicator) {
                indicator.classList.toggle('selected', !!this.selections[type]);
            }
        });

        // Habilitar/Deshabilitar botón de confirmar en el header de BGA
        const isReady = this.selections.A && this.selections.B && this.selections.C;
        this.game.setActionButtonDisabled('confirm_heroes_button', !isReady);
    }

    public getFinalSelection(): number[] {
        return Object.values(this.selections).filter((id): id is number => id !== null);
    }

    /**
     * Envía la selección de héroes al back-end
     */
    public confirmSelection(): void {
        const selection = this.getFinalSelection();

        if (selection.length !== 3) {
            console.error("Debe seleccionar exactamente 3 héroes");
            return;
        }

        // Enviar al back-end usando la acción 'selectHeroes'
        this.game.bgaPerformAction("actSelectHeroes", {
            cardA: selection[0],
            cardB: selection[1],
            cardC: selection[2]
        });
    }
}