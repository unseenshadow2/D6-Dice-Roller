function start()
{
	
}

// This function serves as the function to be called from an html page.
// 		type is the type of system you want to roll for.
//		pool_id is the id of a number input that represents the size of the roll pool.
//		dc_id is the id of a number input that represents the dc of the roll.
//		output_id is the id of the object to which the results of the roll will be outputted.
// 		exploding is a boolean value as to whether or not the dice are exploding (reroll 6's).
function frontRoll(type, pool_id, dc_id, output_id, exploding = false)
{
	// The elements from which our data comes
	var e_pool = document.getElementById(pool_id);
	var e_dc = document.getElementById(dc_id);
	var out = document.getElementById(output_id);
	
	// The variable we will display with
	var toShow = "";
	
	// The supported types of rolls
	switch(type)
	{
		case "basic_d6":
			out.value = roll_basicD6(e_pool.value, e_dc.value) + "\n\n" + out.value;
			break;
			
		case "shadowrun5":
			out.value = roll_shadowrun5(e_pool.value, e_dc.value, exploding) + "\n\n" + out.value;
			break;
			
		default:
			window.alert("Invalid roll type presented.");
	}
	//if (type == "basic_d6")
	//{
		
	//}
	//else if 
}

// Roll a die of a number of sides specified by the sides variable.
function rollDie(sides)
{
	var toReturn = Math.floor(Math.random() * sides) + 1;
	return toReturn;
}

 // Roll an array of dice
function rollDice(sides, count, exploding)
{
	toReturn = new Array();
	
	var currentDie = 0;
	for (i = 0; i < count; i++)
	{
		currentDie = rollDie(sides);
		toReturn.push(currentDie);
		
		while (exploding && (currentDie == sides)) 
		{  
			currentDie = rollDie(sides);
			toReturn.push(currentDie);
		}
	}
	
	return toReturn;
}

// Returns an item with 'hits', 'failures', 'roll'.
function roll_basic(count, exploding = false)
{
	var roll = rollDice(6, count, exploding);
	var toReturn = [];
	var hits = 0;
	var failures = 0;
	var hitValues = [5,6];
	var failValues = [1];
	
	var rollLength = roll.length;
	var hitLength = hitValues.length;
	var failLength = failValues.length;
	for (var i = 0; i < rollLength; i++)
	{
		// Calculate hits
		for (var j = 0; j < hitLength; j++)
		{
			if (roll[i] == hitValues[j]) { hits += 1; }
		}
		
		// Calculate failures
		for (var j = 0; j < failLength; j++)
		{
			if (roll[i] == failValues[j]) { failures += 1; }
		}
	}
	
	toReturn["roll"] = roll;
	toReturn["hits"] = hits;
	toReturn["failures"] = failures;
	
	return toReturn;
}

// Handles a Basic D6 roll, and spits out the roll in human readable format
function roll_basicD6(count, dc)
{
	if((typeof dc) == "string")
	{
		dc = parseInt(dc);
	}
	
	//var x = document.getElementById(output_id);
	var roll = roll_basic(count);
	var output = "";
	var crit_value = (dc > 2)?(dc*2):(dc+2); // Determine when we crit success
	var netHits = roll["hits"]-dc;
	
	// Our booleans for the roll
	var crit = (roll["hits"] >= crit_value);
	var cons = (roll["hits"] <= roll["failures"]);
	var success = (roll["hits"] >= dc);
	
	//console.log("Crit_value: " + crit_value + " | DC: " + dc + " | Crit: " + crit + " | Cons: " + cons + " | Success: " + success);
	
	// Prepare our output
	if (crit) // Crit success
	{
		output = "Critical Success!\nNet Hits: " + netHits + "\n\n";
	}
	else if (success) // Normal success
	{
		output = "Success!\nNet Hits: " + netHits + "\n\n";
	}
	else // Failure
	{
		output = "Failure!\nNegative Hits: " + netHits + "\n\n";
	}
	
	if (cons)
	{
		output += "You have earned a consequence!\n\n";
	}
	
	output += "Hits: " + roll["hits"] + "\n";
	output += "Failures: " + roll["failures"] + "\n\n";
	output += "Roll:\n" + roll["roll"] + "\n";
	output += "--------------------------------------";
	
	return output;
}

function roll_shadowrun5(count, dc, exploding)
{
	if((typeof dc) == "string")
	{
		dc = parseInt(dc);
	}
	
	//var x = document.getElementById(output_id);
	var roll = roll_basic(count, exploding);
	var output = "";
	var crit_value = dc + 4; // Determine when we crit success
	var netHits = roll["hits"]-dc;
	
	// Our booleans for the roll
	var crit = (roll["hits"] >= crit_value);
	var cons = (roll["failures"] >= count / 2);
	var success = (roll["hits"] >= dc);
	
	if (cons && !success) { output = "Critical GLITCH!!!\n\n"; } 
	else if (success && !crit && !cons) { output = "Success.\n\n"; }
	else if (success && crit && !cons) { output = "Critical Success!\nAsk your GM what this means for you.\n\n"; }
	else if (success && crit && cons) { output = "Critical Success and a Glitch!\nAsk your GM what this means for you.\n\n"; }
	else if (success && !crit && cons) { output = "Success and Glitch.\n\n";}
	else if (!success && !cons) { output = "You fail, but no glitch.\n\n"; }
	
	output += "Net Hits: " + netHits + "\n";
	output += "Hits: " + roll["hits"] + "\n";
	output += "Failures: " + roll["failures"] + "\n\n";
	output += "Roll:\n" + roll["roll"] + "\n";
	output += "--------------------------------------";
	
	return output;
}