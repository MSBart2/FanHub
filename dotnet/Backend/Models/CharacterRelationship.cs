namespace Backend.Models;

public class CharacterRelationship
{
    public int Id { get; set; }
    public int CharacterId { get; set; }
    public int RelatedCharacterId { get; set; }
    public string? RelationshipType { get; set; }
}
