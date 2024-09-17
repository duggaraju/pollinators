namespace Pollinators.Server.Models
{
    public enum Scope
    {
        Dashboard,
        Query
    }

    public static class ScopeExtensions
    {
        public static bool TryParseScope(string value, out Scope result)
        {
            return Enum.TryParse(value, true, out result);
        }
    }
}
