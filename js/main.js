class PathfinderTimeline extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "pathfinder-timeline",
      title: "Pathfinder Campaign Timeline",
      template: "modules/pathfinder-timeline/templates/timeline.html",
      width: 500,
      height: "auto",
      closeOnSubmit: false,
      resizable: true,
      submitOnClose: true
    });
  }

  getData() {
    let data = game.settings.get('pathfinder-timeline', 'timelineData') || {
      location: "Startort",
      characters: {
        character1: { name: "Char1", last_slept: { day: 0, period: "Nacht" } },
        character2: { name: "Char2", last_slept: { day: 0, period: "Nacht" } },
        character3: { name: "Char3", last_slept: { day: 0, period: "Nacht" } }
      },
      events: [],
      periods: ["Vormittag", "Nachmittag", "Nacht"],
      days: Array.from({ length: 14 }, (_, i) => i + 1)
    };
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("#update-location").click(this._updateLocation.bind(this));
    html.find("#add-event").click(this._addEvent.bind(this));
    html.find("#update-sleep").click(this._updateSleep.bind(this));
    html.find("#add-character").click(this._addCharacter.bind(this));
  }

  _updateLocation(event) {
    event.preventDefault();
    const location = $("#location").val();
    this.object.location = location;
    this._saveData();
    this.render();
  }

  _addEvent(event) {
    event.preventDefault();
    const day = parseInt($("#event-day").val());
    const period = $("#event-period").val();
    const description = $("#event-description").val();
    this.object.events.push({ day, period, description });
    this._saveData();
    this.render();
  }

  _updateSleep(event) {
    event.preventDefault();
    const charName = $("#character").val();
    const day = parseInt($("#sleep-day").val());
    const period = $("#sleep-period").val();
    this.object.characters[charName].last_slept = { day, period };
    this._saveData();
    this.render();
  }

  _addCharacter(event) {
    event.preventDefault();
    const charName = $("#new-character-name").val();
    const newCharKey = `character${Object.keys(this.object.characters).length + 1}`;
    this.object.characters[newCharKey] = { name: charName, last_slept: { day: 0, period: "Nacht" } };
    this._saveData();
    this.render();
  }

  _saveData() {
    game.settings.set('pathfinder-timeline', 'timelineData', this.object);
  }
}

Hooks.on("init", () => {
  game.settings.registerMenu("pathfinder-timeline", "timeline", {
    name: "Pathfinder Campaign Timeline",
    label: "Timeline Settings",
    hint: "Configure the Pathfinder campaign timeline.",
    type: PathfinderTimeline,
    restricted: true
  });

  game.settings.register("pathfinder-timeline", "timelineData", {
    name: "Timeline Data",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
});

Hooks.on("ready", () => {
  // Add a button to the UI menu
  let button = $('<button><i class="fas fa-calendar-alt"></i> Timeline</button>');
  button.on('click', () => {
    new PathfinderTimeline().render(true);
  });

  $('#sidebar-tabs').append(button);

  game.pathfinderTimeline = new PathfinderTimeline();
});
