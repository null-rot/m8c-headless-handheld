// =====================================================================
//  Teensy 4.1 two-part snap-fit case, with heatsink clearance
// ---------------------------------------------------------------------
//  BOTTOM : closed shell, flat back, PCB ledges, SD access
//  TOP    : honeycomb roof, heatsink opening, USB aperture
//  JOINT  : tongue-and-groove + 4 segmented snap beads
//
//  microSD socket is TOP-mounted at the end opposite the USB, so access
//  is an open mouth in the top half (see sd_at_minus_y). USB aperture
//  and SD mouth are both cut from BOTH halves, straddling the split
//  plane, so neither jack ends up buried or fouled by the tongue.
//  The heatsink opening in the roof is chamfered on both faces: relief
//  on the outer face for a proud heatsink, lead-in on the inner face so
//  the lid drops over the sink instead of catching on it.
//
//  Both halves are emitted open-side-up = print orientation. No supports.
//
//  Tuning: change fit_clear ONLY. Everything else is structural.
//
//  Full parameter reference: see the README in this folder.
// =====================================================================

// ----- what to render -------------------------------------------------
// "bottom" | "top" | "both" | "test" | "assembled"
part = "both";

// ----- board ----------------------------------------------------------
board_l      = 59.0;
board_w      = 17.8;
board_t      = 1.6;
usb_over     = 1.6;    // USB jack overhang past the PCB edge

// ----- clearances -----------------------------------------------------
clr_side     = 0.35;
clr_end      = 0.50;
under_board  = 1.80;   // microSD socket + solder tails
over_board   = 3.40;   // USB jack + tallest components  (was 3.00)

// ----- shell ----------------------------------------------------------
wall         = 2.10;
floor_t      = 1.60;
roof_t       = 1.40;
corner_r     = 1.60;
cav_corner_r = 1.00;

// ----- snap joint -----------------------------------------------------
//  >>> THE ONLY DIAL YOU SHOULD NEED <<<
fit_clear    = 0.15;
lip_h        = 2.60;
lip_t        = 0.85;
lead_in      = 0.55;
bead         = 0.60;
bead_len     = 16.0;
bead_z       = 1.30;
bead_proud   = 0.40;   // how far the bump pokes out past the tongue's
                        // own face; the rest of its radius is buried in
                        // the tongue so it's backed by solid material

// ----- USB aperture (+Y end, above the PCB) ---------------------------
usb_w        = 8.60;   // jack is 7.5 wide
usb_h        = 3.50;   // jack is 2.55 tall
usb_drop     = 0.40;   // how far the aperture starts BELOW the PCB top
usb_chamfer  = 2.60;   // lead-in on the outer face, per side

// ----- microSD access -------------------------------------------------
//  Socket is mounted on the TOP of the board at the end OPPOSITE the USB,
//  so the card sits ABOVE the split plane. Access is an open mouth in the
//  top half rather than a slot, so you can get a fingertip on the card.
//  Set sd_at_minus_y = false if your board is fitted the other way round.
sd_at_minus_y = true;
sd_w         = 12.0;   // mouth width; card is 11 wide
sd_drop      = 0.00;   // how far the mouth starts BELOW the PCB top
sd_chamfer   = 0.00;   // lead-in on the outer face, per side

//  Finger-pull groove: a semicircular scallop cut into the TOP of the
//  roof, right at the SD mouth, so a fingertip can hook the card's top
//  edge to pull it out. Sits between sd_notch_inset_l/r (measured in
//  from each side edge of the SD mouth) and cuts sd_notch_depth into
//  the lid, starting from the outer edge of the case.
sd_notch         = true;   // set false to omit the finger groove
sd_notch_inset_l = 0.00;   // gap kept clear at the LEFT edge of the mouth
sd_notch_inset_r = 0.00;   // gap kept clear at the RIGHT edge of the mouth
sd_notch_depth   = 4.50;   // how far the scallop reaches into the lid

// ----- heatsink opening -----------------------------------------------
heatsink     = true;
hs_size      = 9.00;   // your heatsink is 9 x 9 x 5
hs_clear     = 0.40;   // per side
hs_margin    = 2.00;   // solid roof kept around the opening
hs_offset_y  = 3.00;   // nudge along the board if the chip is not centred
hs_chamfer   = 0.60;   // 45 deg relief on the OUTER face (snag/feel)
hs_lead_in   = 0.40;   // 45 deg lead-in on the INNER face (assembly)

// ----- honeycomb ------------------------------------------------------
hex_af       = 4.50;
hex_web      = 1.20;
rail_end     = 3.00;
rail_side    = 1.00;

// ----- PCB retention --------------------------------------------------
ledge_w      = 1.50;
clamp_pads   = true;
pad_l        = 4.00;
pad_w        = 1.40;
pad_inset    = 3.00;   // from each end of the PCB

$fn = 48;
eps = 0.01;

// =====================================================================
//  DERIVED
// =====================================================================
cav_w    = board_w + 2 * clr_side;
cav_l    = board_l + 2 * clr_end + usb_over;
cav_h    = under_board + board_t + over_board;

out_w    = cav_w + 2 * wall;
out_l    = cav_l + 2 * wall;
out_h    = cav_h + floor_t + roof_t;

split_z  = floor_t + under_board + board_t;   // split plane = top of PCB
roof_z   = floor_t + cav_h;                   // underside of the roof
skirt_t  = wall - lip_t - fit_clear;
groove_d = bead * 0.95;

board_y0 = -cav_l/2 + clr_end;                // PCB -Y edge
board_y1 = board_y0 + board_l;                // PCB +Y edge (connector end)
board_yc = (board_y0 + board_y1) / 2;

usb_z0   = split_z - usb_drop;
sd_sign  = sd_at_minus_y ? -1 : 1;
sd_z0    = split_z - sd_drop;
sd_h     = roof_z - sd_z0;
hs_open  = hs_size + 2 * hs_clear;
hs_cy    = board_yc + hs_offset_y;

echo(str("OUTER    ", out_w, " x ", out_l, " x ", out_h, " mm"));
echo(str("SPLIT    z = ", split_z, "   ROOF UNDERSIDE z = ", roof_z));
echo(str("USB      z ", usb_z0, " -> ", usb_z0 + usb_h, "  (straddles the split)"));
echo(str("SD       z ", sd_z0, " -> ", roof_z, "  (", sd_h, " tall, ", sd_w,
         " wide, ", sd_at_minus_y ? "-Y" : "+Y", " end)"));
echo(str("HEATSINK ", hs_open, " sq at y = ", hs_cy,
         "  outer face ", hs_open + 2*hs_chamfer,
         " sq, inner ", hs_open + 2*hs_lead_in, " sq"));
echo(str("         straight bore ", roof_t - hs_chamfer - hs_lead_in, " mm"));
echo(str("SKIRT    ", skirt_t, " mm   BEAD BITE ", bead - fit_clear, " mm"));

// =====================================================================
//  PRIMITIVES
// =====================================================================
module rbox(w, l, h, r) {
    hull() for (sx = [-1, 1], sy = [-1, 1])
        translate([sx * (w/2 - r), sy * (l/2 - r), 0])
            cylinder(r = r, h = h);
}

module zband(z0, z1) {
    translate([-(out_w + 6)/2, -(out_l + 6)/2, z0])
        cube([out_w + 6, out_l + 6, z1 - z0]);
}

module yband(len) {
    translate([-(out_w + 6)/2, -len/2, -2])
        cube([out_w + 6, len, out_h + 4]);
}

module outer_solid() { rbox(out_w, out_l, out_h, corner_r); }

module cavity() {
    translate([0, 0, floor_t]) rbox(cav_w, cav_l, cav_h + eps, cav_corner_r);
}

module shell() { difference() { outer_solid(); cavity(); } }

// =====================================================================
//  JOINT
// =====================================================================
module tongue() {
    difference() {
        hull() {
            translate([0, 0, split_z])
                rbox(cav_w + 2*lip_t, cav_l + 2*lip_t, eps, cav_corner_r + lip_t);
            translate([0, 0, split_z + lip_h - lead_in])
                rbox(cav_w + 2*lip_t, cav_l + 2*lip_t, eps, cav_corner_r + lip_t);
            translate([0, 0, split_z + lip_h - eps])
                rbox(cav_w + 2*lip_t - 2*lead_in, cav_l + 2*lip_t - 2*lead_in,
                     eps, max(0.3, cav_corner_r + lip_t - lead_in));
        }
        translate([0, 0, split_z - eps])
            rbox(cav_w, cav_l, lip_h + 2*eps, cav_corner_r);
    }
}

module beads() {
    bead_x = cav_w/2 + lip_t - (bead - bead_proud);
    for (sx = [-1, 1], sy = [-1, 1])
        translate([sx * bead_x, sy * cav_l * 0.24, split_z + bead_z])
            rotate([90, 0, 0])
                cylinder(r = bead, h = bead_len, center = true, $fn = 32);
}

// annulus only - must NOT eat into the roof above the cavity
module tongue_pocket() {
    difference() {
        translate([0, 0, split_z - eps])
            rbox(cav_w + 2*(lip_t + fit_clear), cav_l + 2*(lip_t + fit_clear),
                 roof_z - split_z + eps, cav_corner_r + lip_t + fit_clear);
        translate([0, 0, split_z - 3*eps])
            rbox(cav_w, cav_l, roof_z - split_z + 5*eps, cav_corner_r);
    }
}

module bead_groove() {
    bead_x = cav_w/2 + lip_t - (bead - bead_proud);
    for (sx = [-1, 1], sy = [-1, 1])
        translate([sx * (bead_x + fit_clear), sy * cav_l * 0.24, split_z + bead_z])
            rotate([90, 0, 0])
                cylinder(r = groove_d, h = bead_len + 2, center = true, $fn = 32);
}

// =====================================================================
//  USB APERTURE  - cut from BOTH halves, straddles the split plane
// =====================================================================
module usb_window() {
    // straight bore from the cavity out through the wall
    translate([-usb_w/2, cav_l/2 - 2, usb_z0])
        cube([usb_w, wall + 4, usb_h]);

    // flared lead-in on the outer face so a plug overmould can nose in
    hull() {
        translate([-usb_w/2, cav_l/2 - eps, usb_z0])
            cube([usb_w, eps, usb_h]);
        translate([-(usb_w + 2*usb_chamfer)/2, out_l/2 + 1, usb_z0 - usb_chamfer])
            cube([usb_w + 2*usb_chamfer, eps, usb_h + 2*usb_chamfer]);
    }
}

// =====================================================================
//  microSD ACCESS  - open mouth at the far end, cut from BOTH halves
// =====================================================================
module sd_window() {
    // straight bore from the cavity out through the end wall
    translate([-sd_w/2, sd_sign * (cav_l/2 + wall/2 + 1) - (wall + 4)/2, sd_z0])
        cube([sd_w, wall + 4, sd_h + eps]);

    // flared lead-in on the outer face for finger access
    hull() {
        translate([-sd_w/2, sd_sign * cav_l/2 - eps/2, sd_z0])
            cube([sd_w, eps, sd_h + eps]);
        translate([-(sd_w + 2*sd_chamfer)/2, sd_sign * (out_l/2 + 1) - eps/2,
                   sd_z0 - sd_chamfer])
            cube([sd_w + 2*sd_chamfer, eps, sd_h + sd_chamfer + eps]);
    }
}

// =====================================================================
//  SD FINGER-PULL GROOVE
//  A half-pipe scalloped into the top face of the roof, mouth of the
//  scallop flush with the outer wall, dishing inward over sd_notch_depth.
// =====================================================================
module sd_finger_notch() {
    if (sd_notch) {
        notch_x0 = -sd_w/2 + sd_notch_inset_l;
        notch_x1 =  sd_w/2 - sd_notch_inset_r;
        notch_w  = notch_x1 - notch_x0;
        if (notch_w > eps) {
            r = sd_notch_depth;
            translate([notch_x0 + notch_w/2, sd_sign * out_l/2, out_h])
                rotate([0, 90, 0])
                    cylinder(r = r, h = notch_w, center = true, $fn = 64);
        }
    }
}

// =====================================================================
//  HEATSINK OPENING
// =====================================================================
module hs_square(size, z, h) {
    translate([-size/2, hs_cy - size/2, z]) cube([size, size, h]);
}

module heatsink_cut() {
    if (heatsink) {
        // straight bore
        hs_square(hs_open, roof_z - 1, roof_t + 2);

        // 45 deg chamfer on the outer face. In print orientation the roof
        // is on the plate, so this is a 45 deg overhang - prints clean.
        if (hs_chamfer > 0)
            hull() {
                hs_square(hs_open, out_h - hs_chamfer, eps);
                hs_square(hs_open + 2*hs_chamfer, out_h - eps, eps);
            }

        // 45 deg lead-in on the inner face. Faces up when printing, so
        // it costs nothing.
        if (hs_lead_in > 0)
            hull() {
                hs_square(hs_open, roof_z + hs_lead_in, eps);
                hs_square(hs_open + 2*hs_lead_in, roof_z - eps, eps);
            }
    }
}

// =====================================================================
//  HONEYCOMB  - whole cells only, and kept clear of the heatsink
// =====================================================================
module honeycomb_cells(h) {
    dx = hex_af + hex_web;
    dy = dx * sin(60);
    R  = hex_af / (2 * cos(30));           // circumradius
    rx = cav_w/2 - rail_side;
    ry = cav_l/2 - rail_end;
    hs_wide = hs_open + 2 * max(hs_chamfer, hs_lead_in);
    kx = hs_wide/2 + hs_margin + R;        // heatsink keep-out
    ky = hs_wide/2 + hs_margin + R;
    nx = ceil(rx / dx) + 1;
    ny = ceil(ry / dy) + 1;
    for (j = [-ny : ny], i = [-nx : nx]) {
        cx = i * dx + (j % 2 == 0 ? 0 : dx/2);
        cy = j * dy;
        inside  = (abs(cx) <= rx && abs(cy) <= ry);
        keepout = heatsink && (abs(cx) <= kx && abs(cy - hs_cy) <= ky);
        if (inside && !keepout)
            translate([cx, cy, 0])
                rotate([0, 0, 30])
                    cylinder(h = h, d = hex_af / cos(30), $fn = 6);
    }
}

// solid roof islands above each clamp pad so the pads fuse to the roof
module pad_shadow() {
    if (clamp_pads)
        for (sx = [-1, 1], py = [board_y0 + pad_inset, board_y1 - pad_inset])
            translate([sx * (board_w/2 - 0.6) - (pad_w + 2.0)/2,
                       py - (pad_l + 2.0)/2, roof_z - 1])
                cube([pad_w + 2.0, pad_l + 2.0, roof_t + 3]);
}

module vent_cut() {
    difference() {
        intersection() {
            translate([0, 0, roof_z - eps]) honeycomb_cells(roof_t + 2*eps);
            translate([0, 0, roof_z - 1])
                rbox(cav_w - 2*rail_side, cav_l - 2*rail_end, roof_t + 2,
                     cav_corner_r);
        }
        pad_shadow();
    }
}

// =====================================================================
//  PCB RETENTION
// =====================================================================
module ledges() {
    for (sx = [-1, 1])
        translate([sx * (cav_w/2 - ledge_w/2) - ledge_w/2,
                   board_y0 - 0.3, floor_t])
            cube([ledge_w, board_l + 0.6, under_board]);
}

module pads() {
    if (clamp_pads)
        for (sx = [-1, 1], py = [board_y0 + pad_inset, board_y1 - pad_inset])
            translate([sx * (board_w/2 - 0.6) - pad_w/2, py - pad_l/2, split_z])
                cube([pad_w, pad_l, roof_z - split_z + 0.3]);
}

// =====================================================================
//  HALVES
// =====================================================================
module bottom_half() {
    union() {
        difference() {
            union() {
                intersection() { shell(); zband(-1, split_z); }
                tongue();
                beads();
            }
            usb_window();     // sub-split slice of the USB aperture + tongue
            sd_window();      // clears the tongue so the card can come out
        }
        ledges();             // full length again - nothing cut away now
    }
}

module top_half() {
    union() {
        difference() {
            intersection() { shell(); zband(split_z, out_h + 1); }
            tongue_pocket();
            bead_groove();
            usb_window();
            sd_window();
            sd_finger_notch();
            heatsink_cut();
            vent_cut();
        }
        pads();
    }
}

module top_for_print() {
    translate([0, 0, out_h]) rotate([180, 0, 0]) top_half();
}

// =====================================================================
//  OUTPUT
// =====================================================================
if (part == "bottom") bottom_half();

else if (part == "top") top_for_print();

else if (part == "assembled") { bottom_half(); top_half(); }

else if (part == "both") {
    translate([-(out_w/2 + 3), 0, 0]) bottom_half();
    translate([ (out_w/2 + 3), 0, 0]) top_for_print();
}

else if (part == "test") {
    // 24 mm coupon of each half for dialling in fit_clear
    translate([-(out_w/2 + 3), 0, 0])
        intersection() { bottom_half(); yband(24); }
    translate([ (out_w/2 + 3), 0, 0])
        intersection() { top_for_print(); yband(24); }
}
