{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- amenazaGigante implementation : © <Your name here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------
-->
<div id="ag-game-container">

    <div id="hero-selection-phase" class="ag-phase-container" style="display:none">
        <div class="ag-selection-wrapper">
            <div class="ag-selection-header">
                <h2>{CHOOSE_YOUR_TEAM}</h2>
                <p>{SELECT_ONE_OF_EACH}</p>
                
                <div id="selection-status-bar">
                    <div id="indicator-A" class="type-badge">A</div>
                    <div id="indicator-B" class="type-badge">B</div>
                    <div id="indicator-C" class="type-badge">C</div>
                </div>
            </div>

            <div id="hero-selection-grid"></div>
            
            <div class="ag-selection-footer">
                <button id="confirm_heroes_button" class="ag-btn-confirm" disabled>
                    {CONFIRM_SELECTION}
                </button>
            </div>
        </div>
    </div>

    <div id="main-game-phase" class="ag-phase-container" style="display:none">
        
        <div id="ag-table-layout">
            
            <div id="giant-section" class="ag-section">
                <h3>{GIANT_PATH}</h3>
                <div id="giant-path-container">
                    </div>
            </div>

            <div id="heroes-section" class="ag-section">
                <h3>{HEROES_RONDELS}</h3>
                <div id="heroes-container">
                    </div>
            </div>

            <div id="city-section" class="ag-section">
                <h3>{CITY_INTEGRITY}</h3>
                <div id="city-board-container">
                    </div>
            </div>

        </div>
    </div>

</div>

<script type="text/javascript">
    var jstpl_hero_tooltip = '<div class="hero-tooltip"><h3>${name}</h3><p>${description}</p></div>';
</script>

{OVERALL_GAME_FOOTER}