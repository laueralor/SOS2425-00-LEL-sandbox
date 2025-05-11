<script>
    import { dev } from "$app/environment";

    let baseAPI = "/api/v1";
    if (dev){
        baseAPI = "http://localhost:16078/api/v1";
    }

    const team = [
        {
            name: "Laura Eraso Lorenzo",
            frontend: "/home-buying-selling-stats",
            api: `${baseAPI}/home-buying-selling-stats`,
            postman: "https://documenter.getpostman.com/view/42241739/2sB2j98UnV",
            dataset: "home-buying-selling-stats",
            integration: "/integrations/LEL"
        }
    ];
    const github = "https://github.com/laueralor/SOS2425-00-LEL-sandbox";
</script>

<h1>Proyecto Laura Eraso</h1>

<a href="/analytics">Integración grupal</a>

<h2>Miembros del equipo y sus recursos</h2>

<ul>
    {#each team as member}
        <li>
            <strong>{member.name}</strong><br>
            Frontend: <a href="{member.frontend}">{member.frontend}</a><br>
            API: <a href="{member.api}">{member.api}</a><br>
            Postman: <a href="{member.postman}">{member.postman}</a><br>
            Dataset: {member.dataset}<br>
            Integraciones: <a href="{member.integration}">{member.integration}</a><br>
        </li>
        <br>
        
    {/each}
</ul>

<h2>Repositorio del equipo</h2>
<a href="{github}">{github}</a>

