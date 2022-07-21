// import things from './things.png'

const imagePrefixer = (image) => `/img/chase-os/${image}`

const TOOLS = [
  {
    name: 'Figma',
    image: 'figma.png',
    description: `Figma is a tool for creating and managing digital designs. It's a great tool for creating and managing digital designs.`,
  },
  {
    name: 'Things',
    image: 'things.png',
    description: 'A simple game about chasing things.',
  },
]

export const Tools = () => {
  return (
    <div className="tools-list">
      {TOOLS.map((tool) => (
        <div key={tool.name} className="tool">
          <img src={imagePrefixer(tool.image)} alt="" />
          <div>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
