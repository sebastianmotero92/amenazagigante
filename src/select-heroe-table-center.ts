class SetupHeroTableCenter {
  constructor(
    private game: AmenazaGiganteGame,
    gamedatas: AmenazaGiganteGamedatas
  ) {
    document.getElementById(`city-table-row`).insertAdjacentHTML(
      "beforeend",
      `                
            <div>
                <div class="name-wrapper">
                    <span class="name" style="color: #red;">City</span>
                </div>
                <div id="city-table-cards" class="city-table-cards">
                    <div class="city-card" id="city-card">
                        <div class="city-tracks" id="city-tracks"></div>
                    </div>
                </div>
            </div>
        `
    );

    document.getElementById(`city-tracks`).insertAdjacentHTML(
      "beforeend",
      `
                      <div class="track-token" id="token-life"></div>
              `
    );
  }
}
