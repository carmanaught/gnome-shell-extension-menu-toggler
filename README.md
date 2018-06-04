DEPRECATED: This repository has been deprecated and moved to https://gitlab.com/carmanaught/gnome-shell-extension-menu-toggler/

# Menu Toggler
**Note:** I am no longer actively using GNOME and therefore will not be fixing bugs.

This is a relatively simple extension I pieced together that can be used to toggle menus in GNOME, like the 'Aggregate Menu'/'User Menu' (the one with the Volume/Network/Battery status indicators) or whichever other menu you like. This may be useful if an extension you're using has a menu but no way to quickly toggle it and you'd like some way to bring it up.

This was written as using a keybinding and trying to toggle a menu via gdbus seems to block a subsequent key-press from toggling the menu (or I'm unable to figure out the correct command(s)) but doing it from an extension seems to work fine.

Currently, the two menus that have been given keybind options, accessible from Main.panel.statusArea (assuming Main = imports.ui.main here of course), are aggregateMenu and appMenu. appMenu normally has a keybinding already, but is useful as an additional example to show how to add more menus to the extension.

In regards to adding more menus, you'll have to look at the extension code and modify it yourself if you want it to toggle other menus. To get the menu names, use the Looking Glass and type

```
Main.panel.statusArea.
```

(without quotes and yes, include that last dot) and press tab at the dot to get a list of properties/methods/objects and look for the menu you want there.

It's up to you to know which items are menus you want, but if you think something is a menu, you can start typing something that shows up with the tab list and then see if you can add menu after it, e.g.:

```
Main.panel.statusArea.aggregateMenu.menu
```

If you can start typing 'menu' and there are properties/methods/objects that can be used under that, then it's probably in fact a menu. What you're ultimately looking for is 'toggle()', making a complete line:

```
Main.panel.statusArea.aggregateMenu.menu.toggle()
```

Ultimately you'll have to read through the extension code to figure out what to add for new menus such as connecting signals to watch for shortcut changes and adding new extension settings keys, etc. Only consider using this if it either already does what you want, or you're willing to look at the code to extend it for other menus you want to use it for.

You'll need to enable the extension and reload gnome-shell (Alt+F2, type 'r', Enter/Return), then specify a keybinding.

## Credits

Thanks to Jonny Lamb and Pawel Bogut for some of the code ideas I copied from the [Hide Legacy Tray](https://github.com/jonnylamb/shell-hide-legacy-tray) extension and Tudmotu for some code and ideas from the [Clipboard Indicator](https://github.com/Tudmotu/gnome-shell-extension-clipboard-indicator) extension.
