class CityTableCenter {
  constructor(
    private game: AmenazaGiganteGame,
    gamedatas: AmenazaGiganteGamedatas
  ) {
    console.log("CityTableCenter constructor", gamedatas);

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
                      <div class="track-token" id="token-attack"></div>
                      <div class="track-token" id="token-repair"></div>
                      <div class="track-token" id="token-moral"></div>
                      <div class="track-token" id="token-ammo"></div>
                      <div class="track-token" id="token-tools"></div>
                      <div class="track-token" id="token-trumpet"></div>
                      <div class="track-token" id="token-destruction"></div>
      
                      <div class="${TRACK.GIANT_LIFE} life1" id="${TRACK_ID.GIANT_LIFE}1"></div>
                      <div class="${TRACK.GIANT_LIFE} life2" id="${TRACK_ID.GIANT_LIFE}2"></div>
                      <div class="${TRACK.GIANT_LIFE} life3" id="${TRACK_ID.GIANT_LIFE}3"></div>
                      <div class="${TRACK.GIANT_LIFE} life4" id="${TRACK_ID.GIANT_LIFE}4"></div>
                      <div class="${TRACK.GIANT_LIFE} life5" id="${TRACK_ID.GIANT_LIFE}5"></div>
                      <div class="${TRACK.GIANT_LIFE} life6" id="${TRACK_ID.GIANT_LIFE}6"></div>
                      <div class="${TRACK.GIANT_LIFE} life7" id="${TRACK_ID.GIANT_LIFE}7"></div>
                      <div class="${TRACK.GIANT_LIFE} life8" id="${TRACK_ID.GIANT_LIFE}8"></div>
                      <div class="${TRACK.GIANT_LIFE} life9" id="${TRACK_ID.GIANT_LIFE}9"></div>
                      <div class="${TRACK.GIANT_LIFE} life10" id="${TRACK_ID.GIANT_LIFE}10"></div>
      
                      <div class="${TRACK.QUALITY_ATTACK} attack0" id="${TRACK_ID.QUALITY_ATTACK}0"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack1" id="${TRACK_ID.QUALITY_ATTACK}1"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack2" id="${TRACK_ID.QUALITY_ATTACK}2"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack3" id="${TRACK_ID.QUALITY_ATTACK}3"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack4" id="${TRACK_ID.QUALITY_ATTACK}4"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack5" id="${TRACK_ID.QUALITY_ATTACK}5"></div>
      
                      <div class="${TRACK.QUALITY_REPAIR} repair0" id="${TRACK_ID.QUALITY_REPAIR}0"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair1" id="${TRACK_ID.QUALITY_REPAIR}1"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair2" id="${TRACK_ID.QUALITY_REPAIR}2"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair3" id="${TRACK_ID.QUALITY_REPAIR}3"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair4" id="${TRACK_ID.QUALITY_REPAIR}4"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair5" id="${TRACK_ID.QUALITY_REPAIR}5"></div>
      
                      <div class="${TRACK.QUALITY_MORAL} moral0" id="${TRACK_ID.QUALITY_MORAL}0"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral1" id="${TRACK_ID.QUALITY_MORAL}1"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral2" id="${TRACK_ID.QUALITY_MORAL}2"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral3" id="${TRACK_ID.QUALITY_MORAL}3"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral4" id="${TRACK_ID.QUALITY_MORAL}4"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral5" id="${TRACK_ID.QUALITY_MORAL}5"></div>
      
                      <div class="${TRACK.SUPPLY_AMMO} ammo0" id="${TRACK_ID.SUPPLY_AMMO}0"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo1" id="${TRACK_ID.SUPPLY_AMMO}1"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo2" id="${TRACK_ID.SUPPLY_AMMO}2"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo3" id="${TRACK_ID.SUPPLY_AMMO}3"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo4" id="${TRACK_ID.SUPPLY_AMMO}4"></div>
      
                      <div class="${TRACK.SUPPLY_TOOLS} tools0" id="${TRACK_ID.SUPPLY_TOOLS}0"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools1" id="${TRACK_ID.SUPPLY_TOOLS}1"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools2" id="${TRACK_ID.SUPPLY_TOOLS}2"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools3" id="${TRACK_ID.SUPPLY_TOOLS}3"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools4" id="${TRACK_ID.SUPPLY_TOOLS}4"></div>
      
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet0" id="${TRACK_ID.SUPPLY_TRUMPET}0"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet1" id="${TRACK_ID.SUPPLY_TRUMPET}1"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet2" id="${TRACK_ID.SUPPLY_TRUMPET}2"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet3" id="${TRACK_ID.SUPPLY_TRUMPET}3"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet4" id="${TRACK_ID.SUPPLY_TRUMPET}4"></div>
      
                      <div class="${TRACK.CITY_DESTRUCTION} destruction1" id="${TRACK_ID.CITY_DESTRUCTION}1"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction2" id="${TRACK_ID.CITY_DESTRUCTION}2"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction3" id="${TRACK_ID.CITY_DESTRUCTION}3"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction4" id="${TRACK_ID.CITY_DESTRUCTION}4"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction5" id="${TRACK_ID.CITY_DESTRUCTION}5"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction6" id="${TRACK_ID.CITY_DESTRUCTION}6"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction7" id="${TRACK_ID.CITY_DESTRUCTION}7"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction8" id="${TRACK_ID.CITY_DESTRUCTION}8"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction9" id="${TRACK_ID.CITY_DESTRUCTION}9"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction10" id="${TRACK_ID.CITY_DESTRUCTION}10"></div>
              `
    );
  }
}
