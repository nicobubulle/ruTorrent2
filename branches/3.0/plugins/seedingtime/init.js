plugin.loadLang();

if(plugin.enabled)
{
        if(plugin.canChangeColumns())
        {
		plugin.config = theWebUI.config;
		theWebUI.config = function(data)
		{
			this.tables.trt.columns.push({text: 'SeedingTime', width: '100px', id: 'seedingtime', type: TYPE_NUMBER});
			plugin.trtFormat = this.tables.trt.format;
			this.tables.trt.format = function(table,arr)
			{
				for(var i in arr)
				{
   					if(table.getIdByCol(i)=="seedingtime")
	   				{
						arr[i] = arr[i] ? theConverter.date(arr[i]) : "";
						break;
					}
			        }
				return(plugin.trtFormat(table,arr));
			}
			theRequestManager.addRequest("trt", "d.get_custom=seedingtime",function(hash,torrent,value)
			{
				torrent.seedingtime = value;
			});
			plugin.config.call(this,data);
			plugin.trtRenameColumn();
		}

		plugin.trtRenameColumn = function()
		{
			if(plugin.allStuffLoaded)
			{
				theWebUI.getTable("trt").renameColumnById("seedingtime",theUILang.seedingTime);
				if(thePlugins.isInstalled("rss"))
					plugin.rssRenameColumn();
			}
			else
				setTimeout(arguments.callee,1000);
		}

		plugin.rssRenameColumn = function()
		{
			if(theWebUI.getTable("rss").created)
				theWebUI.getTable("rss").renameColumnById("seedingtime",theUILang.seedingTime);
			else
				setTimeout(arguments.callee,1000);
		}
	}

	plugin.onRemove = function()
	{
		theWebUI.getTable("trt").removeColumnById("seedingtime");
		if(thePlugins.isInstalled("rss"))
			theWebUI.getTable("rss").removeColumnById("seedingtime");
	}
}
