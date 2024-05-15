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
    // Default data structure
    let data = {
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
  }

  _updateLocation(event) {
    event.preventDefault();
    const location = $("#location").val();
    this.object.location = location;
    this.render();
  }

  _addEvent(event) {
    event.preventDefault();
    const day = parseInt($("#event-day").val());
    const period = $("#event-period").val();
    const description = $("#event-description").val();
    this.object.events.push({ day, period, description });
    this.render();
  }

  _updateSleep(event) {
    event.preventDefault();
    const charName = $("#character").val();
    const day = parseInt($("#sleep-day").val());
    const period = $("#sleep-period").val();
    this.object.characters[charName].last_slept = { day, period };
    this.render();
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
});

Hooks.on("ready", () => {
  game.settings.register("pathfinder-timeline", "timelineData", {
    name: "Timeline Data",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.pathfinderTimeline = new PathfinderTimeline();
});
