/*
 * Credit to Jonny Lamb and Pawel Bogut for adapting some of the code from the Hide
 * Legacy Tray extension used in this preferences dialog.
 *
 */

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Self = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Self.imports.convenience;

const GObject = imports.gi.GObject;

// Import config
const config = Self.imports.config;

const COLUMN_ID          = 0;
const COLUMN_DESCRIPTION = 1;
const COLUMN_KEY         = 2;
const COLUMN_MODS        = 3;

let settings;

function init() {
    this.settings = Convenience.getSettings();
}

function buildPrefsWidget() {
    let vbox = new Gtk.Box({
        orientation : Gtk.Orientation.VERTICAL,
        margin : 10,
        margin_top : 15,
        spacing : 10
    });

    let treeView = createKeybindingWidget();
    // Create key bindings here using the const names defined in config.js for each menu you want
    addKeybinding(treeView.model, settings, config.aggregate_menu, "Toggle the aggregate/user menu (" + config.aggregate_menu_name + ")");
    addKeybinding(treeView.model, settings, config.app_menu, "Toggle the application menu (" + config.app_menu_name + ")");

    let scrolled = new Gtk.ScrolledWindow();
    scrolled.vexpand = true;
    scrolled.add(treeView);
    scrolled.show_all();

    vbox.add(scrolled);
    vbox.show_all();
    return vbox;
}

function createKeybindingWidget() {
    let model = new Gtk.ListStore();

    model.set_column_types(
            [GObject.TYPE_STRING, // COLUMN_ID
             GObject.TYPE_STRING, // COLUMN_DESCRIPTION
             GObject.TYPE_INT,    // COLUMN_KEY
             GObject.TYPE_INT]);  // COLUMN_MODS

    let treeView = new Gtk.TreeView();
    treeView.model = model;
    treeView.headers_visible = false;
    treeView.expand = true;

    let column, renderer;

    // Description column.
    renderer = new Gtk.CellRendererText();

    column = new Gtk.TreeViewColumn();
    column.expand = true;
    column.pack_start(renderer, true);
    column.add_attribute(renderer, "text", COLUMN_DESCRIPTION);

    treeView.append_column(column);

    // Key binding column.
    renderer = new Gtk.CellRendererAccel();
    renderer.accel_mode = Gtk.CellRendererAccelMode.GTK;
    renderer.editable = true;

    renderer.connect("accel-edited",
            function (renderer, path, key, mods, hwCode) {
                let [ok, iter] = model.get_iter_from_string(path);
                if(!ok)
                    return;

                // Update the UI.
                model.set(iter, [COLUMN_KEY, COLUMN_MODS], [key, mods]);

                // Update the stored setting.
                let id = model.get_value(iter, COLUMN_ID);
                let accelString = Gtk.accelerator_name(key, mods);
                settings.set_strv(id, [accelString]);
            });

    renderer.connect("accel-cleared",
            function (renderer, path) {
                let [ok, iter] = model.get_iter_from_string(path);
                if(!ok)
                    return;

                // Update the UI.
                model.set(iter, [COLUMN_KEY, COLUMN_MODS], [0, 0]);

                // Update the stored setting.
                let id = model.get_value(iter, COLUMN_ID);
                settings.set_strv(id, []);
            });

    column = new Gtk.TreeViewColumn();
    column.pack_end(renderer, false);
    column.add_attribute(renderer, "accel-key", COLUMN_KEY);
    column.add_attribute(renderer, "accel-mods", COLUMN_MODS);

    treeView.append_column(column);

    return treeView;
}

function addKeybinding(model, settings, id, description) {
    // Get the current accelerator.
    let accelerator = settings.get_strv(id)[0];
    let key, mods;
    if (accelerator == null)
        [key, mods] = [0, 0];
    else
        [key, mods] = Gtk.accelerator_parse(settings.get_strv(id)[0]);

    // Add a row for the keybinding.
    let row = model.insert(100); // Erm...
    model.set(row,
            [COLUMN_ID, COLUMN_DESCRIPTION, COLUMN_KEY, COLUMN_MODS],
            [id,        description,        key,        mods]);
}
