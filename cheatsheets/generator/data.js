const data = [
  {
    column: 1,
    section: "Editing",
    actions: [
      {
        name: "Change Value",
        secondary: "fine",
        description: "hold EDIT + [ LEFT or RIGHT ]",
        command: "edithold left right",
      },
      {
        name: "Change Value",
        secondary: "coarse",
        description: "hold EDIT + [ UP or DOWN ]",
        command: "edithold up down",
      },
      {
        name: "Cut Value",
        secondary: "or set to default",
        description: "EDIT + OPTION",
        command: "edit option",
      },
    ],
  },
  {
    column: 1,
    section: "Play",
    actions: [
      {
        name: "Play All Tracks",
        secondary: "from song cursor",
        description: "hold SHIFT + PLAY",
        command: "shifthold play",
      },
      {
        name: "Mute Current Track",
        description: "hold OPTION + SHIFT",
        extra: "(latch mute by releasing OPTION first)",
        command: "optionhold shift",
      },
      {
        name: "Solo Current Track",
        secondary: "or Row (Live Mode)",
        description: "hold OPTION + PLAY",
        extra: "(latch solo by releasing OPTION first)",
        command: "optionhold play",
        page: 11,
      },
      {
        name: "Solo Tracks",
        secondary: "left or right (Song Screen)",
        description: "hold OPTION + [ LEFT or RIGHT ] ",
        command: "optionhold left right",
      },
      {
        name: "Clear All Mute",
        secondary: " and solos",
        description: "hold OPTION + hold SHIFT + PLAY",
        command: "optionhold shifthold play",
        page: 11,
      },
      {
        name: "Play Selection",
        secondary: "(Selection Mode)",
        description: "hold SHIFT + PLAY",
        command: "shifthold play",
        selection: true,
      },
    ],
  },
  {
    column: 2,
    section: "Copy / Paste / Clone",
    actions: [
      {
        name: "Enter Selection Mode",
        description: "hold SHIFT + OPTION",
        extra: "(tap OPTION to cycle through modes)",
        command: "shifthold option",
      },
      {
        name: "Copy Selection",
        secondary: "(exit mode)",
        description: "OPTION",
        command: "option",
      },
      {
        name: "Paste Copy Buffer",
        description: "hold SHIFT + EDIT",
        command: "shifthold edit",
      },
      {
        name: "Clone and Paste",
        secondary: "Chain, Phrase, or Instrument",
        description: "hold SHIFT + OPTION then EDIT",
        command: "shifthold option1st edit2nd",
      },
      {
        name: "Deep Clone",
        secondary: "with all contents",
        description: "hold SHIFT + OPTION then double-tap EDIT",
        command: "shifthold option1st edit2nd double",
      },
      {
        name: "Copy / Clone Instrument",
        secondary: "in Inst Screen or Pool",
        description: "hold SHIFT + OPTION",
        command: "shifthold option",
      },
    ],
  },
  {
    column: 1,
    section: "File Browser",
    actions: [
      {
        name: "Preview Sample",
        description: "PLAY",
        command: "play",
      },
      {
        name: "Sort Directory",
        description: "SHIFT + OPTION",
        command: "shift option",
      },
      {
        name: "Delete Selected File",
        description: "EDIT + OPTION",
        command: "edit option",
      },
    ],
  },
  {
    column: 2,
    section: "Song Screen",
    actions: [
      {
        name: "Execute Insert",
        description: "SHIFT + OPTION + EDIT",
        extra: "This will paste your clipboard data and shift all subsequent rows in that track (or tracks) downward to make room.",
        command: "shift option edit",
      },
      {
        name: "Create",
        secondary: "new chain",
        description: "double-tap EDIT",
        command: "edit double",
      },
      {
        name: "Toggle Live Mode",
        description: "hold SHIFT + LEFT",
        command: "shifthold left",
      },
      {
        name: "Jump 16 Rows",
        secondary: "up or down",
        description: "hold OPTION + [ UP or DOWN ] ",
        command: "optionhold up down",
      },
      {
        name: "Move Selection",
        description: "hold EDIT + [ UP or DOWN ]",
        command: "edithold up down",
        selection: true,
      },
      {
        name: "Render Selection",
        description: "double-tap EDIT",
        command: "edit double",
        selection: true,
      },
      {
        name: "Bookmark",
        secondary: "Mark a Chain",
        description: "Triple-tap OPTION",
        command: "option",
      },
      {
        name: "Track Select / Reorder",
        secondary: "Move Track",
        description: "Row 00: 2xUP. Move: Hold EDIT + L/R",
        command: "up double",
      },
    ],
  },
  {
    column: 2,
    section: "Chain Screen",
    actions: [
      {
        name: "Create",
        secondary: "new phrase",
        description: "double-tap EDIT",
        command: "edit double",
      },
      {
        name: "Jump to Track",
        secondary: "left or right",
        description: "hold OPTION + [ LEFT or RIGHT ] ",
        command: "optionhold left right",
      },
      {
        name: "Jump to Chain",
        secondary: "previous or next",
        description: "hold OPTION + [ UP or DOWN ]",
        command: "optionhold up down",
      },
    ],
  },
  {
    column: 2,
    section: "Sample Editor",
    actions: [
      {
        name: "Lazy Chop",
        secondary: "add slice marker",
        description: "during playback, hold PLAY then tap EDIT",
        command: "playhold edit",
      },
      {
        name: "Zoom / Fine Select",
        description: "hold EDIT + [ LEFT or RIGHT ]",
        command: "edithold left right",
      },
      {
        name: "Snap Selection",
        secondary: "to beat",
        description: "hold OPTION + [ UP or DOWN ]",
        command: "optionhold up down",
      },
    ],
  },
  {
    column: 3,
    section: "Instrument Screen",
    actions: [
      {
        name: "Preview Instrument",
        description: "hold EDIT + PLAY",
        command: "edithold play",
      },
      {
        name: "Jump to Instrument",
        secondary: "previous or next",
        description: "OPTION + [ LEFT or RIGHT ] ",
        command: "optionhold left right",
      },
      {
        name: "Quick FX Jump",
        secondary: "auto-assign FX",
        description: "on parameter, hold SHIFT + [ LEFT or RIGHT ]",
        command: "shifthold left right",
      },
    ],
  },
  {
    column: 3,
    section: "Phrase Screen",
    actions: [
      {
        name: "Create",
        secondary: "new instrument",
        description: "on instrument column, EDIT (double-tap)",
        command: "edit double",
      },
      {
        name: "Jump to Track",
        secondary: "left or right",
        description: "hold OPTION + [ LEFT or RIGHT ] ",
        command: "optionhold left right",
      },
      {
        name: "Jump to Phrase",
        secondary: "previous or next",
        description: "hold OPTION + [ UP or DOWN ] ",
        command: "optionhold up down",
      },
      {
        name: "Transpose",
        secondary: "Octave",
        description: "hold SHIFT + [ UP or DOWN ]",
        command: "shifthold up down",
        selection: true,
      },
      {
        name: "Transpose",
        secondary: "Semitone",
        description: "hold SHIFT + [ LEFT or RIGHT ]",
        command: "shifthold left right",
        selection: true,
      },
      {
        name: "Interpolate",
        description: "(single column) hold SHIFT + EDIT",
        command: "shifthold edit",
        selection: true,
      },
      {
        name: "Move",
        secondary: "selection",
        description: "(multi column) hold EDIT + [ UP or DOWN]",
        command: "edithold up down",
        selection: true,
      },
      {
        name: "Note Fill",
        secondary: "",
        description: "(note column) hold OPTION + LEFT",
        command: "optionhold left",
        selection: true,
      },
      {
        name: "Random Fill",
        description: "(note column) hold OPTION + RIGHT",
        extra: "velocity can be randomized if selected",
        command: "optionhold right",
        selection: true,
      },
      {
        name: "Randomize Notes",
        secondary: "Up or Down",
        description: "(note column) hold OPTION + [UP or DOWN]",
        command: "optionhold up down",
        page: 15,
        selection: true,
      },
      {
        name: "Cycle Commands",
        description: "on command column, hold OPTION + [ UP or DOWN ]",
        command: "optionhold up down",
      },
      {
        name: "Effect Help",
        secondary: "on command column",
        description: "hold EDIT + [ UP or DOWN ]",
        command: "edithold up down",
      },
    ],
  },
  {
    column: 3,
    section: "Instrument Pool",
    actions: [
      {
        name: "Select / Load",
        description: "EDIT",
        command: "edit",
      },
      {
        name: "Preview Instrument",
        description: "PLAY",
        command: "play",
      },
      {
        name: "Move Instrument",
        secondary: "reorder list",
        description: "on name column, hold EDIT + [ UP or DOWN ]",
        command: "edithold up down",
      },
      {
        name: "Delete Instrument",
        description: "on name column, EDIT + OPTION",
        command: "edit option",
      },
    ],
  },
  {
    column: 3,
    section: "Mixer Screen",
    actions: [
      {
        name: "Create Snapshot",
        description: "hold SHIFT + OPTION",
        command: "shifthold option",
      },
      {
        name: "Recall Snapshot",
        description: "hold SHIFT + EDIT",
        command: "shifthold edit",
      },
    ],
  },
];
