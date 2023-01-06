
function onLoad()

	rgbcolor = {}
  rgbcolor = {green = {r=72/255, g=165/255, b=72/255}, red = {r=221/255, g=50/255, b=50/255}, blue = {r=105/255, g=212/255, b=255/255}, orange = {r=255/255, g=169/255, b=73/255}, yellow = {r=231/255, g=229/255, b=44/255}}

	math.randomseed( os.time() )
	--RANDOMIZE THE 4 TILES FOR THE MAPS
	fournumbers = {1,2,3,4}
	local tReturn = {}
	for i = #fournumbers, 1, -1 do
			local j = math.random(i)
			fournumbers[i], fournumbers[j] = fournumbers[j], fournumbers[i]
			table.insert(tReturn, fournumbers[i])
	end
	fournumbers = tReturn

	firstround = 0
	if math.random(2) == 1 then
		sideA = true
	end

	-- CREATE BUTTONS FOR END TURN FOR EACH PLAYER
	GreenButton =  getObjectFromGUID('fc6be0')
	button = {}
	button.width = 500
	button.height = 220
	button.rotation = {0, 180, 0}
	button.click_function = 'EndTurnGreen'
	button.color = {r=72/255, g=165/255, b=72/255}
	button.label = 'End Green Turn'
	button.font_size = 50
	--button.function_owner = GreenButton
	GreenButton.createButton(button)

	RedButton =  getObjectFromGUID('5309b6')
	button = {}
	button.width = 500
	button.height = 220
	button.rotation = {0, 180, 0}
	button.click_function = 'EndTurnRed'
	button.color = {r=199/255, g=89/255, b=89/255}
	button.label = 'End Red Turn'
	button.font_size = 50
	--button.function_owner = GreenButton
	RedButton.createButton(button)

	BlueButton =  getObjectFromGUID('7531ec')
	button = {}
	button.width = 500
	button.height = 220
	button.rotation = {0, 0, 0}
	button.click_function = 'EndTurnBlue'
	button.color = {r=105/255, g=212/255, b=255/255}
	button.label = 'End Blue Turn'
	button.font_size = 50
	--button.function_owner = GreenButton
	BlueButton.createButton(button)

	OrangeButton =  getObjectFromGUID('536225')
	button = {}
	button.width = 500
	button.height = 220
	button.rotation = {0, 0, 0}
	button.click_function = 'EndTurnOrange'
	button.color = {r=255/255, g=169/255, b=73/255}
	button.label = 'End Orange Turn'
	button.font_size = 50
	--button.function_owner = GreenButton
	OrangeButton.createButton(button)

	--BUTTON TO START GAME FOR 2 PLAYERS
	setupgameButton2 =  getObjectFromGUID('4c8adb')
	button = {}
	button.width = 600
	button.height = 520
	button.rotation = {0, 180, 0}
	button.click_function = 'setupgame2'
	button.color = {r=255/255, g=255/255, b=255/255}
	button.label = "Setup Game \n\r2 Players"
	button.font_size = 100
	setupgameButton2.createButton(button)

		--BUTTON TO START GAME FOR 3 PLAYERS
	setupgameButton3 =  getObjectFromGUID('aada0f')
	button = {}
	button.width = 600
	button.height = 520
	button.rotation = {0, 180, 0}
	button.click_function = 'setupgame3'
	button.color = {r=255/255, g=255/255, b=255/255}
	button.label = "Setup Game\n\r3 Players"
	button.font_size = 100
	setupgameButton3.createButton(button)

		--BUTTON TO START GAME FOR 4 PLAYERS
	setupgameButton4 =  getObjectFromGUID('005840')
	button = {}
	button.width = 600
	button.height = 520
	button.rotation = {0, 180, 0}
	button.click_function = 'setupgame4'
	button.color = {r=255/255, g=255/255, b=255/255}
	button.label = "Setup Game\n\r4 Players"
	button.font_size = 100
	setupgameButton4.createButton(button)


	--BUTTON TO DELETE MAP AND START CUSTOM MAP
	deletemapb =  getObjectFromGUID('b6347c')
	button = {}
	button.width = 600
	button.height = 320
	button.rotation = {0, -90, 0}
	button.click_function = 'deletemap'
	button.color = rgbcolor["red"]
	button.label = "Delete Starting map"
	button.font_size = 50
	deletemapb.createButton(button)

	--BUTTON TO PICK FIRST PLAYER
	firstplayerb =  getObjectFromGUID('74c74f')
	button = {}
	button.width = 600
	button.height = 320
	button.rotation = {0, -90, 0}
	button.click_function = 'firstplayer'
	button.color = rgbcolor["yellow"]
	button.label = "Pick First Player\n\r(All Players are Seated)"
	button.font_size = 50
	firstplayerb.createButton(button)

end

function dump(o)
   if type(o) == 'table' then
      local s = '{ '
      for k,v in pairs(o) do
         if type(k) ~= 'number' then k = '"'..k..'"' end
         s = s .. '['..k..'] = ' .. dump(v) .. ','
      end
      return s .. '} '
   else
      return tostring(o)
   end
end

--END TURN FUNCTIONS -- TO CALL EACH COLOR
function EndTurnGreen() EndTurn('green') end
function EndTurnRed() EndTurn('red') end
function EndTurnOrange() EndTurn('orange') end
function EndTurnBlue() EndTurn('blue') end
function setupgame2(obj) setupgame('2') end
function setupgame3(obj) setupgame('3') end
function setupgame4(obj) setupgame('4') end


function firstplayer() --ENABLE TURNS AND SELECT the first player
	Turns.enable = true
	local FPMpos = {}
	FPMpos["Green"] = {40.46, 0.96, -22.49}
	FPMpos["Red"] = {-40.46, 0.96, -22.49}
	FPMpos["Blue"] = {-40.46, 0.96, 22.49}
	FPMpos["Orange"] = {40.46, 0.96, 22.49}
	playerColor = {}
	playerNumber = {}
	playerName = {}
	playerList = Player.getPlayers()
	firstPlayerNum = math.random(1, #playerList) --RANDOM PLAYER
	local nextPlayer = firstPlayerNum

	--CHECK IF PLAYERS ARE Seated
	if #playerList < 1 then --Ashton
	  broadcastToAll("Click the Yellow button once everyone (2+) is seated to pick turns", {1,1,1})
	else
		for i = 1, #playerList do --MOVE THROUGH THE COLORS TO SAVE PLAYER ORDER
			playerColor[i] = playerList[nextPlayer].color --SAVE PLAYER COLOR
			playerName[i] = playerList[nextPlayer].steam_name
			playerNumber[string.lower(playerColor[i])] = i
			nextPlayer = nextPlayer + 1 --GET NEXT PLAYER NEXT
			if nextPlayer > #playerList then nextPlayer = 1 end
		end

	  broadcastToAll('First Player is... ' .. playerName[1] .. '! (' .. playerColor[1] .. ")", {1,1,1})
		getObjectFromGUID('d34454').setPositionSmooth(FPMpos[playerColor[1]], false, false) --Move first player pyramid
	end

end

function moveBarb()
	barbBase = getObjectFromGUID('e7e071')
	BBx = barbBase.getPosition() -- starting sample {-32.71, 0.96, 20.64}
--	dump(BBx)

	barbMarker = getObjectFromGUID('35a82b')
	barbDialPos = {{-2.67, 0.66}, {-0.12, 2.72}, {2.55, 1.02}, {1.76, -2.13}, {-1.33, -2.3}}
	--Starting barbDialPos = {{-35.37, 1.06, 21.30}, {-32.83, 1.06, 23.36},{-30.16, 1.06, 21.66},{-30.95, 1.06, 18.51},{-34.04, 1.06, 18.34}}
	bmx = barbMarker.getPosition()
--	dump(bmx)
	currentPos = 1

	for x = 1 , #barbDialPos do --Check the 5 places
		if math.sqrt( (bmx[1] - barbDialPos[x][1] - BBx[1] )^2  + (bmx[3] - barbDialPos[x][2] - BBx[3])^2 ) < 1  then
			currentPos = x
			break
		end
	end
	nextPos = currentPos + 1
	if nextPos == 6 then nextPos = 1 end
	barbMarker.setPositionSmooth({BBx[1] + barbDialPos[nextPos][1], BBx[2] + 0.1, BBx[3] + barbDialPos[nextPos][2]}, false, false)

	barbTalk = {"Barbarians Respawn!", "Barbarians do nothing", "Barbarians Move! (Roll a die)","Gain 1 Trade Token for each Mature City", "Barbarians Move! (Roll a die)"}
	broadcastToAll(barbTalk[nextPos], rgbcolor["yellow"])

end

--DELETE ORIGINAL MAP TILES
function deletemap(obj)
  obj.destruct()
  local mapids = {"a6866d", "64c657", "15bd4a", "79efcf", "9f2d0d", "f6da67", "f66585", "4f4673", "71feec", "f401a1", "bbeda0", "000851", "9b382f", "5d693b", "4e0d89", "b459cd"}
	--DELETE MAP TILES
	for i, mapid in ipairs(mapids) do
--    getObjectFromGUID(mapid).destruct()
		getObjectFromGUID(mapid).setPositionSmooth({66.11, -2.51 + i*0.1, -48.00},false, true)
		getObjectFromGUID(mapid).setRotationSmooth({0,0,0})
		getObjectFromGUID(mapid).scale(0.2,0.2,0.2)
  end
	--MOVE BARBARIAN TOKENS
	local barbids = {"740193","2c5f24","55a71e","7ea72a","1fc156","3845f6","f484a0", "2632fe", "ccd811"}
	for i, barbid in ipairs(barbids) do
		getObjectFromGUID(barbid).setPositionSmooth({-8.00 - i*3, 1.00, -24.00},false, true)
  end
	--MOVE NATURAL WONDERS TOKENS
	local nwonids = {"5c4dfa", "fa92a8", "08ecba", "dab6c2"}
	for i, nwonid in ipairs(nwonids) do
		getObjectFromGUID(nwonid).setPositionSmooth({-11.00 + i*3.2, 1.00, -24.00},false, true)
  end

	--DEAL NEW BAGS OF MAP TILES
	bag = getObjectFromGUID("7d750c")
	TradeTokens = getObjectFromGUID("a2796d")

	bag.takeObject({flip = false, position = {50, 1.12, 0}})

	tilePosX = {-9.15,-0.54,4.65,13.32}
	tilePosZ = {-3,0,-3.06,0}
	tileRotation = {180,0,180,0}
	MapBag = {}

	for i = 1, 4 do --TAKE 4 BAGS OUT AND DEAL THE BASE TILES
		bag.takeObject({flip = false, position = {33.00, 1.00, 25.00 - i*7} , callback_function = function(obj) ProcessMapTile(obj, i) end})
	end

	--BUTTON TO PICK DEAL CARDS AND PICK FIRST PLAYER
	dealb =  getObjectFromGUID('1adb9c')
	button = {}
	button.width = 400
	button.height = 520
	button.rotation = {0, -90, 0}
	button.click_function = 'DealMapTiles'
	button.color = rgbcolor["yellow"]
	button.label = "DEAL MAP TILES\n\r(All Players \n\rare Seated)"
	button.font_size = 50
	dealb.createButton(button)

	getObjectFromGUID('74c74f').destruct() --DELETE OTHER PLAYER COUNTING BUTTON


end


function ProcessMapTile(obj, i)
	obj.randomize()
	MapBag[i] = obj
	--A SIDE DIMENTIONS
	--sideA
	if i == 3 or i == 2 then --IF BAG FOR NATURAL WONDERS OR CITY STATES PLACE TWO CARDS
		for x = 1 + firstround, 2 + firstround do --PLACE 2, THEN PLACE THE NEXT 2
			if sideA then -- SIDE A
				obj.takeObject({position = {tilePosX[fournumbers[x]], 1.01, tilePosZ[fournumbers[x]]}, rotation	= {0,tileRotation[fournumbers[x]],0}, callback_function = function(obj) obj.setLock(true) end })
				TradeTokens.takeObject({position = {tilePosX[fournumbers[x]], 3, tilePosZ[fournumbers[x]]}})

			else --SIDE B
				obj.takeObject({position = {tilePosX[fournumbers[x]], 1.01, tilePosZ[fournumbers[x]] * -1}, rotation	= {180,tileRotation[fournumbers[x]],0}, callback_function = function(obj) obj.setLock(true) end })
				TradeTokens.takeObject({position = {tilePosX[fournumbers[x]], 3, tilePosZ[fournumbers[x]] * -1} })
			end
			obj.takeObject({position = {33.00, 3.64, -6.00}, rotation	= {0,0,0}}) --put the other two into the third bag
		end -- /for loop
		firstround = 2
		obj.destruct()
	end
			--broadcastToAll('Side A', {0,0,0})
end


function DealMapTiles()
	--Bag 4 is currently = 4c0a0e
	firstplayer()
	MapBag[1].randomize()
	MapBag[4].randomize()
	local MTpos = {}
	MTpos["Green"] = {10, -20}
	MTpos["Red"] = {-30, -20}
	MTpos["Blue"] = {-30, 20}
	MTpos["Orange"] = {10, 20}

	for x = 1, #playerColor do
--		dump(MTpos[playerColor[x]])
		MapBag[1].takeObject({position = {MTpos[playerColor[x]][1] , 4, MTpos[playerColor[x]][2]}, rotation	= {0,0,0}}) --DEAL CAPITAL TILES
		MapBag[4].takeObject({position = {MTpos[playerColor[x]][1] + 10 , 4, MTpos[playerColor[x]][2] }, rotation	= {0,0,0}}) --DEAL 2 OTHER TILES
		MapBag[4].takeObject({position = {MTpos[playerColor[x]][1] + 20 , 4, MTpos[playerColor[x]][2] }, rotation	= {0,0,0}}) --DEAL 2 OTHER TILES
		--1adb9c
	end

	MapBag[1].destruct()
	MapBag[4].destruct()
	getObjectFromGUID('1adb9c').destruct()

end


--SET UP GAME CARDS
function setupgame(players)
  if players == '2' then
    broadcastToAll('Set Up for 2 Players', {1,1,1})
  elseif players == '3' then
	    broadcastToAll('Set Up for 3 Players', {1,1,1})
	else
    	broadcastToAll('Set Up for 4 Players', {1,1,1})
  end

	getObjectFromGUID('4c8adb').destruct() --destroy 2 player button
	getObjectFromGUID('aada0f').destruct() --destroy 3 player button
	getObjectFromGUID('005840').destruct() --destroy 4 player button
 -- DISPLAY WONDER CARDS --
 ---------------------------
  local wondercards = {}
  local zoneGrab = {}
  local color = {'blue', 'red', 'yellow', 'purple'}
  local placementZ = {-8.00, -3.00, 3, 8}

  --ZONES TO GET CARDS FROM: MODERN, MEDIEVAL, ANCHIENT
  zoneGrab['blue'] = { "3ee577", "2edbc2","db7402"}
  zoneGrab['red'] = { "6d68da", "317ae5","8c37d7"}
  zoneGrab['yellow'] = { "7fa4c8", "900d5c","e45b1a"}
  zoneGrab['purple'] = { "f50329", "b07aff","11071a"}

  for c=1, 4 do --FOR EACH COLOR
    for i=1, 3 do --FOR EACH DECK OF CARDS
      --SAVE ALL ITEM'S GUIDs IN EACH ZONE
      wondercards[i] =  getObjectFromGUID(zoneGrab[color[c]][i]).getObjects()
--      print("Card #" .. i .. " zone: " .. zoneGrab[color[c]][i])

      for k, obj in pairs(wondercards[i]) do
        -- MOVE ALL LOWER CARDS UP A SPOT
        obj.flip()
        obj.randomize()


        if i == 1 then --PLACE MODERN CARDS
          obj.setPositionSmooth({-40.00, 1.15 + i, placementZ[c]},false, true)
        elseif i == 2 then --PLACE MEDIEVAL CARDS
          if players == '2' then
            obj.takeObject({flip = true, position = {65.17, 1, -48.00} }) -- TRASH ONE
            obj.takeObject({flip = true, position = {-40.00, 1.15 + 0.25 + i, placementZ[c]} })
          else
            obj.setPositionSmooth({-40.00, 1.15 + i, placementZ[c]},false, true)
          end
        elseif i == 3 then -- PLACE ANCIENT CARDS
          if players == '2' or players == '3' then
            obj.takeObject({flip = true, position = {65.17, 1, -48.00} }) --TRASH ONE
            obj.takeObject({flip = false, position = {-40.00, 1.15 + 1 + i, placementZ[c]} })
          else
            obj.takeObject({flip = true, position = {-40.00, 1.15 + i, placementZ[c]} })
            obj.takeObject({flip = false, position = {-40.00, 1.15 + 1 + i, placementZ[c]} })
          end
        end

      end

    end
  end

 -- DISPLAY VICTORY CARDS --
 ---------------------------
	deck = getObjectFromGUID('12cc67')
  if deck~=nil then
    deck.randomize()
    for c=1, 3 do --get 3 cards
      deck.takeObject({position = {-49,1.5,-10+(c*5)}, rotation={0,90,0}, flip = false}) --DISPLAY 3 VICTORY CARDS
    end
    deck.setPositionSmooth({65.17, 1, -48.00},false, true) --GET RID OF REMAINING VICTORY CARDS
  end

end --/end Start 3/4 player game functino

--END TURN
function setTurnOrder(order)
    Turns.type = 2 -- Enable custom turn ordering
    Turns.order = order
    -- Yes, really..
    Turns.enable = false
    Turns.enable = true
end

--CALL THE END TURN BY COLOR
function EndTurn(color)

	if playerNumber == nil then firstplayer() end --SET FIRST PLAYER IF NOT DONE.

  local useCard = {}
  local grabCard = {}
  local cardPlacement = {}
  local activateCard = 0
  local zoneActive = {}
  local zoneGrab = {}

  --SAVE ALL SCRIPT ZONES BY COLOR
  zoneGrab['green'] = { "52f8fc", "89b343","4881cb","032b4c","18a040"}
  zoneActive['green'] = { "40dd2c", "5766a4","c6ae38","1cc709","f24b98"}
  zoneGrab['red'] = { "e7c0d9", "c269f5","1fe659","87dfc8","ed5f75"}
  zoneActive['red'] = { "ea66ed", "fb8d41","cd497c","6e0fc6","08650e"}
  zoneGrab['orange'] = { "e76288", "a47fc0","6f7400","46139d","b0c188"}
  zoneActive['orange'] = { "1f053e", "d43d6f","742703","98d6d0","5e0e90"}
  zoneGrab['blue'] = { "72f56a", "93d125","3f8c7c","30140d","0b2627"}
  zoneActive['blue'] = { "100e23", "c3cf45","bb999d","e6ee29","d5854f"}
  -- WHERE SHOULD WE PUT THE CARDS? CARD X = 1, 2, 3, 4, 5,   Z = 6
  cardPlacement['green'] = {"12.86","18.80","24.24","29.73","35.36", "-32.30"}
  cardPlacement['red'] = {"-35.48","-29.85","-24.24","-18.64","-13.07", "-32.30"} -- {-35.48, 1.03, -32.30}
  cardPlacement['orange'] = {"35.50","29.88","24.31","18.69","13.07", "32.30"} -- {35.50, 1.03, 32.30}{13.07, 1.03, 32.30}
  cardPlacement['blue'] = {"-12.96","-18.52","-24.14","-29.71","-35.30", "32.30"} -- {-12.96, 1.03, 32.30}



  for i=1, 5 do
    --SAVE ALL ITEM'S GUIDs IN EACH ZONE
    useCard[i] =  getObjectFromGUID(zoneActive[color][i]).getObjects()
    grabCard[i] =  getObjectFromGUID(zoneGrab[color][i]).getObjects()
    -- CHECK IF THERE'S AN ACTIVATED CARD TO USE
    for k,v in pairs(useCard[i] ) do
      activateCard = i
      activateCardID = v.getGUID()
      activateName = v.getName()
			v.setPositionSmooth({cardPlacement[color][1], 1.15, cardPlacement[color][6]},false, false)
    end
  end

  if activateCard == 0 then --IF NO CARD ACTIVATED, GIVE INSTRUCTIONS

    broadcastToAll(color ..', Move card you want to use down 1/2" first.', {0,0,0})


  else --SUCCESS
    broadcastToAll(string.upper(color) .. " uses ".. activateName .. " (Slot #" .. activateCard .. ")", rgbcolor[color])

		x=1
    for k, obj in pairs(grabCard[activateCard]) do  --MOVE ACTIVATED CARD TO FIRST SLOT
			if obj.tag == "Card" then
        obj.setPositionSmooth({cardPlacement[color][1], 1.15, cardPlacement[color][6]},false, false)
			else
        obj.setPositionSmooth({cardPlacement[color][1] + x/2 -1.5, 1.25 + x/4, cardPlacement[color][6] + x -2},false, false)
				x=x+1
			end
    end
    for i=1, activateCard-1 do -- MOVE OTHER CARDS
		x=1
      for k, obj in pairs(grabCard[i]) do
				if obj.tag == "Card" then
	        obj.setPositionSmooth({cardPlacement[color][i+1], 1.15, cardPlacement[color][6]},false, false)
				else
	        obj.setPositionSmooth({cardPlacement[color][i+1] + x/2 -1.5, 1.25 + x/4, cardPlacement[color][6] + x -2},false, false)
					x=x+1
				end
      end
    end

		--NEXT TURN

		if playerNumber[color] ~= nil then -- Is Color Seated/set
			local order = {}
			x = playerNumber[color]
			for i=1, #playerColor do
				x = x + 1
				if x > #playerColor then x = 1 end
				order[i] = playerColor[x]
			end
			setTurnOrder(order) -- change tur
		end

		if string.lower(playerColor[#playerColor]) == color then --Barns after last player
			moveBarb()
		end
  end
end