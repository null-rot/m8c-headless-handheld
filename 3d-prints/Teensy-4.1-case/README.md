# Teensy 4.1 case (heatsink version)

A two-part snap-fit case for a Teensy 4.1 fitted with a low-profile heatsink, generated
from a parametric OpenSCAD model.

- **Bottom half** - closed shell, flat back, PCB ledges, microSD access.
- **Top half** - honeycomb-vented roof, square heatsink opening, USB aperture.
- **Joint** - tongue-and-groove lip plus 4 segmented snap beads (2 per side).

Both halves are modelled open-side-up, which is also the recommended print orientation -
no supports needed.

## Files

| File | What it is |
|------|-------------|
| [`teensy-4.1-case-heatsink-v1.scad`](teensy-4.1-case-heatsink-v1.scad) | Parametric OpenSCAD source - edit this to change any dimension |
| [`teensy-4.1-case-heatsink-v1.stl`](teensy-4.1-case-heatsink-v1.stl) | Exported mesh of both halves, ready to slice |
| [`teensy-4.1-case-heatsink-v1.3mf`](teensy-4.1-case-heatsink-v1.3mf) | Slicer project (plate layout + print settings) |

## Fit for your board

The model is sized for a bare Teensy 4.1 with a **9 x 9 x 5 mm heatsink** on the main chip,
microSD socket top-mounted at the end opposite the USB connector. If your heatsink, socket
placement, or clearances differ, open the `.scad` file and adjust the parameters below, then
re-render (`part = "both"` gives both halves side by side, ready to print).

The only dial you should normally need is `fit_clear` (snap-joint clearance) - everything
else is structural. `part = "test"` renders a 24 mm coupon of each half so you can dial in
`fit_clear` without printing a full case.

## Parameters

### Board
| Parameter | Value | Meaning |
|---|---|---|
| `board_l` | 61.0 mm | Board length |
| `board_w` | 17.8 mm | Board width |
| `board_t` | 1.6 mm | Board thickness |
| `usb_over` | 1.6 mm | USB jack overhang past the PCB edge |

### Clearances
| Parameter | Value | Meaning |
|---|---|---|
| `clr_side` | 0.35 mm | Side clearance around the board |
| `clr_end` | 0.50 mm | End clearance around the board |
| `under_board` | 1.80 mm | Space below the board (microSD socket + solder tails) |
| `over_board` | 3.40 mm | Space above the board (USB jack + tallest components) |

### Shell
| Parameter | Value | Meaning |
|---|---|---|
| `wall` | 2.10 mm | Outer wall thickness |
| `floor_t` | 1.60 mm | Bottom floor thickness |
| `roof_t` | 1.40 mm | Top roof thickness |
| `corner_r` | 1.60 mm | Outer corner radius |
| `cav_corner_r` | 1.00 mm | Cavity (inner) corner radius |

### Snap joint
| Parameter | Value | Meaning |
|---|---|---|
| `fit_clear` | 0.15 mm | Snap-joint clearance - the tuning dial |
| `lip_h` | 2.60 mm | Tongue height |
| `lip_t` | 0.85 mm | Tongue thickness |
| `lead_in` | 0.55 mm | Tongue lead-in chamfer |
| `bead` | 0.70 mm | Snap bead radius |
| `bead_len` | 16.0 mm | Snap bead length |
| `bead_z` | 1.40 mm | Snap bead height above the split plane |
| `bead_proud` | 0.35 mm | How far each bead pokes past the tongue face |

### USB aperture (+Y end, above the PCB)
| Parameter | Value | Meaning |
|---|---|---|
| `usb_w` | 9.60 mm | Aperture width (jack is 7.5 mm) |
| `usb_h` | 3.50 mm | Aperture height (jack is 2.55 mm) |
| `usb_drop` | 0.50 mm | How far the aperture starts below the PCB top |
| `usb_chamfer` | 0.80 mm | Outer-face lead-in chamfer, per side |

### microSD access
Socket is top-mounted at the end opposite the USB, so the card sits above the split plane;
set `sd_at_minus_y = false` if your board is fitted the other way round.

| Parameter | Value | Meaning |
|---|---|---|
| `sd_at_minus_y` | true | Socket end (true = -Y, opposite the USB) |
| `sd_w` | 15.0 mm | Mouth width (card is 11 mm) |
| `sd_drop` | 0.40 mm | How far the mouth starts below the PCB top |
| `sd_chamfer` | 0.80 mm | Outer-face lead-in chamfer, per side |
| `sd_notch` | true | Finger-pull scallop cut into the roof at the SD mouth |
| `sd_notch_inset_l` / `sd_notch_inset_r` | 2.00 mm | Clear gap kept at each edge of the mouth |
| `sd_notch_depth` | 2.50 mm | How far the scallop reaches into the lid |

### Heatsink opening
| Parameter | Value | Meaning |
|---|---|---|
| `heatsink` | true | Enable the roof opening |
| `hs_size` | 9.00 mm | Heatsink footprint (9 x 9 x 5 mm) |
| `hs_clear` | 0.35 mm | Clearance around the heatsink, per side |
| `hs_margin` | 2.00 mm | Solid roof kept around the opening |
| `hs_offset_y` | 0.00 mm | Nudge along the board if the chip isn't centred |
| `hs_chamfer` | 0.60 mm | 45 deg relief on the outer face |
| `hs_lead_in` | 0.40 mm | 45 deg lead-in on the inner face (assembly) |

### Honeycomb roof vent
| Parameter | Value | Meaning |
|---|---|---|
| `hex_af` | 4.50 mm | Hex cell across-flats size |
| `hex_web` | 1.20 mm | Web thickness between cells |
| `rail_end` | 5.00 mm | Solid margin kept at each end |
| `rail_side` | 1.00 mm | Solid margin kept at each side |

### PCB retention
| Parameter | Value | Meaning |
|---|---|---|
| `ledge_w` | 1.50 mm | Width of the bottom-half PCB ledges |
| `clamp_pads` | true | Add top-half pads that clamp the board to the ledges |
| `pad_l` / `pad_w` | 3.00 / 1.40 mm | Clamp pad size |
| `pad_inset` | 6.00 mm | Pad position, inset from each end of the PCB |

## Notes

- `$fn = 48` - increase for a smoother render, at the cost of slicer/preview speed.
- Rendering with `part = "both"` prints an OUTER / SPLIT / USB / SD / HEATSINK / SKIRT
  summary to the OpenSCAD console, useful for sanity-checking a parameter change before
  slicing.
