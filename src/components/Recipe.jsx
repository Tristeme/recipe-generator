import ReactMarkdown from "react-markdown"
export default function Recipe({ recipe, loading }) {
    return (
      <div className="get-recipe-container">
  
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          {loading && <p><em>Generating recipe...</em></p>}
          {!loading && recipe && (
            <>
              <strong>Recipe Suggestion:</strong>
              <ReactMarkdown>{recipe}</ReactMarkdown>
            </>
          )}
          {!loading && !recipe && (
            <p><em>No recipe yet. Click the button to get one!</em></p>
          )}
        </div>
      </div>
    );
  }
  