# [Crius](https://github.com/unadlib/crius)

Crius tool box with formatter and snippets.

1. Example formatter with `.tsx`
   ![](https://raw.githubusercontent.com/ZouYouShun/vscode-crius-extension/master/doc/assets/example.gif)

2. Create typescript interface with crius example title.

   - Select the example title, `cmd+shift+p` => `crius` => `Create typescript interface with crius example`

3. Custom decorator format sort
   set `"crius-tool.decoratorSort"` at your `.vscode/settings.json`, that can control your decorator format sort at your project.

   default like below,

   ```json
   "crius-tool.decoratorSort": [
       "autorun",
       "ut",
       "it",
       "e2e",
       "manual",
       "p0",
       "p1",
       "p2",
       "p3",
       "app",
       "brand",
       "skip",
       "status",
       "title"
   ]
   ```
