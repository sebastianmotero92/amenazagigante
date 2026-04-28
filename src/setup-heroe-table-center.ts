class SetupHeroTableCenter {
  private selectedHeroes: number[] = [];
  private maxSelection: number = 3;

  constructor(
    private game: AmenazaGiganteGame,
    private args: ArgsHeroSelection
  ) {
    this.createHeroSelectionUI();
  }

  private createHeroSelectionUI() {
    const container = document.getElementById("heroe-table-row");
    if (!container) return;

    container.innerHTML = `
      <div id="hero-selection-container">
        <div class="hero-selection-title">${this.game.dict("Select 3 Heroes (one from each type)")}</div>
        <div class="hero-cards-container" id="hero-cards-container"></div>
        <div class="hero-selection-info" id="hero-selection-info">
          ${this.game.dict("Selected: 0 / 3")}
        </div>
        <button id="confirm-hero-selection" class="btn btn-primary" disabled>
          ${this.game.dict("Confirm Selection")}
        </button>
      </div>
    `;

    this.renderHeroCards();
    this.setupConfirmButton();
  }

  private renderHeroCards() {
    const container = document.getElementById("hero-cards-container");
    if (!container) return;

    const heroes = this.args.heroes || [];
    
    container.innerHTML = heroes.map(hero => `
      <div class="hero-card-select" data-hero-id="${hero.hero_id}" data-type="${hero.type}">
        <div class="hero-card-image">
          <img src="img/heroes/${hero.hero_id}.png" alt="Hero ${hero.hero_id}" />
        </div>
        <div class="hero-card-type">${hero.type}</div>
        <div class="hero-card-check">✓</div>
      </div>
    `).join("");

    // Add click handlers
    container.querySelectorAll(".hero-card-select").forEach(card => {
      card.addEventListener("click", () => {
        const heroId = parseInt(card.getAttribute("data-hero-id"));
        const heroType = card.getAttribute("data-type");
        this.onHeroCardClick(heroId, heroType, card as HTMLElement);
      });
    });
  }

  private onHeroCardClick(heroId: number, heroType: string, cardElement: HTMLElement) {
    // Check if already selected
    const existingIndex = this.selectedHeroes.indexOf(heroId);
    
    if (existingIndex >= 0) {
      // Deselect
      this.selectedHeroes.splice(existingIndex, 1);
      cardElement.classList.remove("selected");
    } else {
      // Check if we already have one of this type
      const typeCount = this.getSelectedCountByType(heroType);
      if (typeCount >= 1) {
        this.game.showMessage(this.game.dict("You can only select 1 hero of each type"), "error");
        return;
      }
      
      if (this.selectedHeroes.length >= this.maxSelection) {
        this.game.showMessage(this.game.dict("You can only select 3 heroes"), "error");
        return;
      }
      
      // Select
      this.selectedHeroes.push(heroId);
      cardElement.classList.add("selected");
    }

    this.updateSelectionInfo();
  }

  private getSelectedCountByType(type: string): number {
    const heroes = this.args.heroes || [];
    return this.selectedHeroes.filter(id => {
      const hero = heroes.find(h => h.hero_id === id);
      return hero?.type === type;
    }).length;
  }

  private updateSelectionInfo() {
    const info = document.getElementById("hero-selection-info");
    if (info) {
      info.textContent = `${this.game.dict("Selected:")} ${this.selectedHeroes.length} / ${this.maxSelection}`;
    }

    const confirmBtn = document.getElementById("confirm-hero-selection") as HTMLButtonElement;
    if (confirmBtn) {
      confirmBtn.disabled = this.selectedHeroes.length !== this.maxSelection;
    }
  }

  private setupConfirmButton() {
    const confirmBtn = document.getElementById("confirm-hero-selection");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        this.confirmSelection();
      });
    }
  }

  private confirmSelection() {
    if (this.selectedHeroes.length !== this.maxSelection) {
      return;
    }

    // Call server action
    this.game.ajaxcall(
      "/" + this.game.game_name + "/" + this.game.game_name + "/actSelectHeroes.html",
      {
        hero_ids: this.selectedHeroes.join(",")
      },
      this.game,
      (result) => {
        // Success - state will change automatically
      },
      (error) => {
        this.game.showMessage(error.message, "error");
      }
    );
  }
}
