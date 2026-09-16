export const SUPABASE_URL = "https://qzcsnkgnygzdrquotdzl.supabase.co/rest/v1";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y3Nua2dueWd6ZHJxdW90ZHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTU5NzQsImV4cCI6MjEwNDU5MTk3NH0.kPFwKQAUf1kUxSKSmm9X3KiDQcKkLu-wM7CMbLKlCnQ";

export const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

export async function supabaseFetch(tableName: string, query: string = "") {
  try {
    // Redirect AWS Realtime Data queries to Hostinger custom API
    if (tableName.startsWith("aws_")) {
      const limitMatch = query.match(/limit=(\d+)/);
      const limit = limitMatch ? limitMatch[1] : "144";
      const apiUrl = `https://sienna-duck-406851.hostingersite.com/api.php?station=${tableName}&limit=${limit}`;
      
      try {
        const apiRes = await fetch(apiUrl, { cache: "no-store" });
        if (apiRes.ok) {
          const data = await apiRes.json();
          if (Array.isArray(data)) {
            return data;
          }
        }
      } catch (apiErr) {
        console.warn(`Custom API fetch failed for ${tableName}, falling back to Supabase direct:`, apiErr);
      }
    }

    const res = await fetch(`${SUPABASE_URL}/${tableName}${query ? `?${query}` : ''}`, {
      method: "GET",
      headers: supabaseHeaders,
      cache: "no-store", // Prevent caching for realtime data
    });
    if (!res.ok) {
      const errorText = await res.text();
      if (errorText.includes("PGRST205") || res.status === 404) {
        console.warn(`Table ${tableName} not found (PGRST205)`);
        return null;
      }
      throw new Error(errorText);
    }
    const data = await res.json();
    if (tableName === "stations" && Array.isArray(data)) {
      return data.filter((st: any) => st.table_name !== "aws_tanggul");
    }
    return data;
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    return null;
  }
}

export async function supabaseInsert(tableName: string, data: any) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${tableName}`, {
      method: "POST",
      headers: supabaseHeaders,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = errorText;
      try {
        const json = JSON.parse(errorText);
        errorMessage = json.message || json.details || errorText;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error inserting to ${tableName}:`, error);
    throw error;
  }
}

export async function supabaseUpdate(tableName: string, idFilter: string, data: any) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${tableName}?${idFilter}`, {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = errorText;
      try {
        const json = JSON.parse(errorText);
        errorMessage = json.message || json.details || errorText;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
}

export async function supabaseDelete(tableName: string, idFilter: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${tableName}?${idFilter}`, {
      method: "DELETE",
      headers: supabaseHeaders,
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = errorText;
      try {
        const json = JSON.parse(errorText);
        errorMessage = json.message || json.details || errorText;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }
}

export async function supabaseRpc(functionName: string, params: any = {}) {
  try {
    const res = await fetch(`https://qzcsnkgnygzdrquotdzl.supabase.co/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: supabaseHeaders,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = errorText;
      try {
        const json = JSON.parse(errorText);
        errorMessage = json.message || json.details || errorText;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`Error executing RPC ${functionName}:`, error);
    return null;
  }
}

// Storage API
const SUPABASE_PROJECT_URL = SUPABASE_URL.replace("/rest/v1", "");

export async function supabaseUploadFile(bucket: string, filePath: string, file: File) {
  try {
    const doUpload = async () => fetch(`${SUPABASE_PROJECT_URL}/storage/v1/object/${bucket}/${filePath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        "x-upsert": "true",
      },
      body: file,
    });

    let res = await doUpload();

    if (!res.ok) {
      let errorText = await res.text();
      if (errorText.includes("row-level security policy")) {
        await supabaseDeleteFile(bucket, filePath);
        res = await doUpload();
        if (!res.ok) {
          errorText = await res.text();
          throw new Error(errorText);
        }
      } else {
        throw new Error(errorText);
      }
    }
    return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${bucket}/${filePath}`;
  } catch (error) {
    console.error(`Error uploading to bucket ${bucket}:`, error);
    throw error;
  }
}

export async function supabaseDeleteFile(bucket: string, filePath: string) {
  try {
    const res = await fetch(`${SUPABASE_PROJECT_URL}/storage/v1/object/${bucket}/${filePath}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      if (res.status === 404 || errorText.includes("NoSuchKey")) {
        return true; 
      }
      throw new Error(errorText);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting from bucket ${bucket}:`, error);
    throw error;
  }
}

export function supabaseGetPublicUrl(bucket: string, filePath: string) {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${bucket}/${filePath}`;
}