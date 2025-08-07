use quote::{ToTokens, quote};
use syn::{Expr, parse::Parse};
use uuid::Uuid;

pub struct ParsedAdapter {
    pub expr: syn::Expr,
}

impl Parse for ParsedAdapter {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let expr: Expr = input.parse()?;
        Ok(Self { expr })
    }
}

impl ToTokens for ParsedAdapter {
    fn to_tokens(&self, tokens: &mut proc_macro2::TokenStream) {
        let decl_key = Uuid::new_v4().as_u128();
        let expr = &self.expr;

        tokens.extend(quote! {
            {
                let mut _element=::ratatui_kit::Element::<::ratatui_kit::components::Adapter>{
                    key: ::ratatui_kit::ElementKey::new(#decl_key),
                    props: ::ratatui_kit::components::AdapterProps{
                        inner: std::sync::Arc::new(#expr)
                    },
                };
                _element
            }
        });
    }
}
