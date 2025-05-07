import { useEffect, useRef, useState } from 'react'

import './App.css'

import Recipe from './components/Recipe';
import IngredientsList from './components/IngredientsList';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipeShown, setRecipeShown] = useState(false);

  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const recipeSection = useRef(null);

  // use onSubmit
  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const newIngredient = formData.get("ingredient").trim();
  //   if (newIngredient) {
  //     setIngredients([...ingredients, newIngredient]);
  //     event.currentTarget.reset(); // clear input
  //   }
  // }

  useEffect(() => {
    if (recipe != "" && recipeSection.current != null) {
      // recipeSection.current.scrollIntoView()
      const yCoord = recipeSection.current.getBoundingClientRect().top;
      window.scroll({
        top: yCoord,
        behavior: "smooth"
      })
    }
  }, [recipe])

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient").trim();
    setIngredients([...ingredients, newIngredient]);
  }


  const showRecipe = async () => {
    setLoading(true);
    setRecipeShown(true)
    setRecipe("");

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const prompt = `Here is a list of ingredients: ${ingredients.join(", ")}. Please suggest a simple recipe I can cook using these.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content;
      setRecipe(result || "No recipe found.");
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setRecipe("Failed to fetch recipe.");
    } finally {
      setLoading(false);
    }
  }
  const ingredientsListItems = ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

  return (
    <div className="container">
      <header className="header">
        <span role="img" aria-label="chef" className="logo">👨‍🍳</span>
        <h1>Chef</h1>
      </header>
      {/* onSubmit={handleSubmit} */}
      <form action={addIngredient} className="form">
        <input
          type="text"
          name="ingredient"
          placeholder="e.g. oregano"
          className="input"
          required
        />
        <button type="submit" className="button">+ Add ingredient</button>
      </form>
      
      { ingredientsListItems.length > 0 && 
      <IngredientsList ref={recipeSection} ingredientsListItems={ingredientsListItems} showRecipe={showRecipe}/>}

      {recipeShown && <Recipe recipe={recipe} loading={loading} />}
    </div>
  );
}

export default App
