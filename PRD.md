# Product Requirements Document for Macua Hair

## App Overview
- Name: Macua Hair
- Tagline: Beleza natural, qualidade excepcional
- Category: cms_website
- Visual Style: Modern Monochrome (e.g. Linear)

## Workflow

Os usuários navegam pelo catálogo de produtos, filtram por características desejadas, visualizam detalhes do produto, selecionam variações, adicionam ao carrinho e finalizam a compra. Administradores podem gerenciar produtos, categorias, pedidos e conteúdo do blog através de um painel administrativo protegido.

## Application Structure


### Route: /

Página inicial com banner de destaque em carrossel, seção de produtos em destaque organizados em grid responsivo, depoimentos de clientes e chamadas para ação. Inclui um seletor de idiomas no cabeçalho, menu de navegação principal e rodapé com links importantes e redes sociais. Design elegante com cores preto, dourado, branco e bege claro.


### Route: /produtos

Catálogo de produtos com sistema de filtros à esquerda (tipo de cabelo, comprimento, cor, origem), ordenação por preço/popularidade e grid de produtos com imagens, nome, preço e botão de adicionar ao carrinho. Cada produto exibe uma prévia ao passar o mouse e paginação na parte inferior. Mantém o mesmo estilo visual sofisticado da página inicial.


### Route: /produto/:id

Página detalhada do produto com galeria de imagens à esquerda, informações detalhadas à direita (nome, preço, avaliações, descrição, especificações técnicas). Inclui seletor de variações (comprimento, cor), quantidade, botão de compra proeminente e seção de produtos relacionados abaixo. Design luxuoso mantendo a identidade visual da marca.


## Potentially Relevant Utility Functions

### getAuth

Potential usage: Verificar o status de autenticação do usuário para funcionalidades de compra e perfil

Look at the documentation for this utility function and determine whether or not it is relevant to the app's requirements.


----------------------------------

### upload

Potential usage: Permitir upload de imagens para produtos e conteúdo do blog

Look at the documentation for this utility function and determine whether or not it is relevant to the app's requirements.

## External APIs
- i18next
  - Usage: Biblioteca de internacionalização para suporte a múltiplos idiomas (português, inglês e francês)
- react-slick
  - Usage: Carrossel de imagens para banners na página inicial e galeria de produtos

## Resources
- Paleta de cores (other): https://coolors.co/000000-d4af37-ffffff-f5f5dc


## Additional Considerations



### Website/Landing Page-Specific Considerations
This app has been classified as a website/landing page, so please consider the following:
- Optimize the website, first and foremost, for mobile web. Ensure that the website is fully responsive.
- Utilize any provided resources (images, navigation URLs, etc.) from the ## Resources section exactly as they are, rather than creating placeholder content when available.
- Consider that website content such as images, tables, and static text can be directly embedded in the frontend components
- If the website would benefit from placeholder content AND no specific content sources (e.g. a source URL) has already been provided by the user, create an idempotent seed script that populates content-related tables (e.g. blog posts). You can make use of the requestMultimodalModel function from ~/server/actions to generate relevant, visually appealing placeholder images. Make sure the frontend is updated to fetch this data from the database rather than hardcoding it. Do NOT create a seed script if the user has provided specific content to use, such as in website clone requests or when resources are provided.
- Write an admin setup endpoint in `api.ts`: This endpoint (e.g. `_makeUserAdmin`) should upsert the current authenticated user (`getUserId`) as an admin.
- Use the runRpcEndpoint tool to invoke the `_makeUserAdmin` RPC method to update the user's admin status. This must be called with `onBehalfOfCurrentUser: true`.
- Create an admin dashboard that makes sense given the project's purpose. For example, a personal or company website might have a dashboard for managing blog posts, images and other cotent. It might also include basic analytics and settings.
- Verify Secure Dashboard Access: Confirm that the dashboard is only visible to users with admin status (e.g., an endpoint `ensureAdminAccess` that uses `getUserId` with `throwIfNotLoggedIn: true`).
- Confirm that there's a way to navigate to the admin dashboard from the main app. The navigation UI should be conditionally rendered based on the user's admin status (e.g. via an endpoint named `getAdminStatus`). It is very important that this endpoint uses `getUserId` with `throwIfNotLoggedIn: false` to ensure that non-authenticated users will not be prompted to login in order to view the website. Failing to do so will break the experience for many websites.